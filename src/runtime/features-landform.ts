/*#
# Landforms

A **landform** is a shaped place on a terrain: a volcano, an impact crater, a
flat construction pad, a gulley, a raised cover for a tunnel. Each is a piece,
placed like a lamp is, and it shapes the ground under it. A volcano also
carries its own **province** (the glow of its caldera and flanks) and its own
**vent**: an `effect` the terrain places on the crater, as busy as the
volcano's `activity` says. Move the volcano and the cone, the glow and the
smoke move together.

```json
{
  "id": "fuji",
  "at": [400, 0, -900],
  "features": { "volcano": { "radius": 420, "height": 260, "activity": 0.5 } }
}
```

The piece's `x` and `z` are the landform's centre; its height is not used
(a landform is a change to the ground, which has its own height). The rest is
tosijs-3d's own schema for the factory (`landformSchemas`, tosijs-3d#119,
ours). A field such as a volcano's `craterRadius` that upstream works out from
another (`radius × 0.22`) is left out of the document until an author sets
it, so it keeps following its source; the panel shows the number it works out
to.

A landform applies to every terrain in the ensemble, or only to the one whose
piece id its `terrain` names. The terrain composes all of them (in document
order, each seeing the ground the previous one left), merges their provinces
by max, gathers their vents, and regenerates.
*/
/*{"parent":"Runtime","order":4}*/
import {
  composeLandforms,
  cover,
  gulley,
  impactCrater,
  landformSchemas,
  mergeProvinces,
  pad,
  volcano,
} from "tosijs-3d";
import { registerFeature } from "../format/registry.js";
import type { FeatureContext } from "../format/registry.js";

type Spec = Record<string, unknown>;
type Fn = (x: number, z: number, h: number) => number;
type Province = (x: number, z: number) => number;
type Vent = unknown;
interface Shaped {
  landform: Fn;
  province?: Province;
  vents?: Vent[];
}

/**
 * One factory per landform kind, and what it returns normalised to
 * `{ landform, province?, vents? }`: `volcano` and `impactCrater` return all
 * three, the others only the height function.
 */
const KINDS = {
  volcano: {
    icon: "🌋",
    title: "Volcano",
    schema: landformSchemas.volcano,
    make: (o: Spec): Shaped => volcano(o as never),
  },
  crater: {
    icon: "🕳️",
    title: "Impact crater",
    schema: landformSchemas.impactCrater,
    make: (o: Spec): Shaped => impactCrater(o as never),
  },
  pad: {
    icon: "⬛",
    title: "Pad",
    schema: landformSchemas.pad,
    make: (o: Spec): Shaped => ({ landform: pad(o as never) }),
  },
  gulley: {
    icon: "🏞️",
    title: "Gulley",
    schema: landformSchemas.gulley,
    make: (o: Spec): Shaped => ({ landform: gulley(o as never) }),
  },
  cover: {
    icon: "🚇",
    title: "Cover",
    schema: landformSchemas.cover,
    make: (o: Spec): Shaped => ({ landform: cover(o as never) }),
  },
} as const;

/** The feature names that are landforms. */
export const LANDFORM_FEATURES = Object.keys(KINDS) as Array<
  keyof typeof KINDS
>;

/** What a landform piece's `bind` returns: its options, and its terrain. */
export interface LandformHandle {
  kind: keyof typeof KINDS;
  options: Spec;
  terrain?: string;
}

/**
 * The upstream schema, minus the fields the PIECE supplies (`x-position`:
 * its x and z), plus ours: `terrain`, a piece id. Derived fields keep
 * upstream's `x-derived` and no default (see the schema panel).
 */
function landformSchema(kind: keyof typeof KINDS): Spec {
  const upstream = KINDS[kind].schema() as {
    properties: Record<string, Spec>;
  };
  const properties: Record<string, Spec> = {};
  for (const [key, spec] of Object.entries(upstream.properties)) {
    if (spec["x-position"]) continue;
    properties[key] = spec;
  }
  properties.terrain = {
    type: "string",
    "x-piece-ref": true,
    title: "On terrain",
    description:
      "The id of the terrain piece this shapes. Empty: every terrain in the ensemble.",
  };
  return {
    type: "object",
    title: KINDS[kind].title,
    "x-accepts": Object.keys(properties),
    properties,
  };
}

export function registerLandformFeatures(): void {
  for (const kind of LANDFORM_FEATURES) {
    registerFeature<LandformHandle>({
      name: kind,
      icon: KINDS[kind].icon,
      primitive: true,
      marker: true,
      // Any change re-shapes the ground, which is the terrain's to do: a
      // rebuild links it again (`applyLandforms`).
      update: () => false,
      schema: landformSchema(kind),
      bind: (_piece, cfg, ctx) => {
        const { terrain, ...options } = cfg as Spec & { terrain?: string };
        return {
          kind,
          options: { ...options, x: ctx.at[0], z: ctx.at[2] },
          terrain: terrain || undefined,
        };
      },
    });
  }
}

/**
 * Shape a terrain with every landform piece that applies to it. Called from
 * the terrain's `link`, when every piece has bound. Returns how many applied.
 */
export function applyLandforms(element: unknown, ctx: FeatureContext): number {
  const shaped: Shaped[] = [];
  for (const piece of ctx.ensemble.pieces) {
    for (const kind of LANDFORM_FEATURES) {
      if (!piece.features?.[kind]) continue;
      const built = ctx.handle(piece.id) as {
        handles?: Map<string, unknown>;
      } | null;
      const handle = built?.handles?.get(kind) as LandformHandle | undefined;
      if (!handle) continue;
      if (handle.terrain && handle.terrain !== ctx.piece.id) continue;
      try {
        shaped.push(KINDS[kind].make(handle.options));
      } catch (error) {
        console.warn(
          `tosijs-3d-ensemble: ${kind} "${piece.id}" could not be made; it is left out.`,
          error
        );
      }
    }
  }
  const target = element as {
    landform?: Fn | null;
    provinceField?: Province | null;
    vents?: Vent[] | null;
  };
  if (!shaped.length) return 0;
  target.landform = composeLandforms(...shaped.map((s) => s.landform));
  const provinces = shaped
    .map((s) => s.province)
    .filter((p): p is Province => !!p);
  target.provinceField = provinces.length ? mergeProvinces(...provinces) : null;
  target.vents = shaped.flatMap((s) => s.vents ?? []);
  return shaped.length;
}
