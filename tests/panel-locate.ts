import type { Page } from "@playwright/test";

/*
  WHERE IS A ROW OF A SYSTEM PANEL ON SCREEN?

  Since the editor's chrome moved onto tosijs-3d system panels drawn IN THE
  SCENE (flat-ui "scene", owner's choice), a panel's content SVG is drawn into
  a texture and is not in the document: a <text> has no on-screen box, and a
  test cannot find a row to click. Two steps:

  - WHERE IN ITS PANEL: the content SVG is attached for a moment off-screen,
    at its own size, and the node's box is read relative to the SVG's;
  - WHERE THAT IS ON SCREEN: the panel element's own `contentToClient`
    (tosijs-3d 0.10.13, our #113), through the plane as drawn. This used to
    be guessed from the anchor plus a 28 px title bar.
*/
export interface Located {
  x: number;
  y: number;
  w: number;
  h: number;
  /** The panel's left edge on screen, for a row's leading control. */
  panelX: number;
  /** ...and its right edge, for a trailing one (a switch, a ⋮). */
  panelRight: number;
  /** Is the node inside the panel's visible (non-scrolled-away) band? */
  inside: boolean;
  /** Centre of the panel on screen. */
  panel: { x: number; y: number };
  /** The panel's title, to scroll it (`scrollPanel`). */
  title: string;
  /** How far the node is below the middle of the panel's visible band. */
  offCentre: number;
}

/*
  SCROLL A PANEL by its own `scrollBy`. The wheel works over an in-scene
  panel since tosijs-3d 0.10.13 (#114; before that it zoomed the camera),
  but scrolling is not what these tests are about.
*/
export const scrollPanel = (page: Page, title: string, dy: number) =>
  page.evaluate(
    ({ title, dy }) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        shadowRoot: ShadowRoot;
      };
      const p = Array.from(
        ed.shadowRoot.querySelectorAll("tosi-b3d-panel")
      ).find((x) => (x as HTMLElement).title === title) as
        | (HTMLElement & { svg: { scrollBy?: (d: number) => void } })
        | undefined;
      p?.svg?.scrollBy?.(dy);
    },
    { title, dy }
  );

/** Locate, scrolling the node's panel until it is in view. */
export const reveal = async (
  page: Page,
  match: string,
  how: "exact" | "endsWith" = "exact",
  tag: "text" | "title" = "text"
): Promise<Located | null> => {
  for (let i = 0; i < 8; i++) {
    const b = await locate(page, match, how, tag);
    if (!b || b.inside) return b;
    await scrollPanel(page, b.title, b.offCentre);
    await page.waitForTimeout(150);
  }
  return locate(page, match, how, tag);
};

/**
 * Locate, once. There is no retry: since tosijs-3d 0.10.14 a content swap
 * happens in place (#111 follow-up), so `contentToClient` does not go null
 * mid-swap, and a null here is a real failure.
 */
export const locate = async (
  page: Page,
  match: string,
  how: "exact" | "endsWith" = "exact",
  tag: "text" | "title" = "text",
  inPanel?: string
): Promise<Located | null> => {
  const r = await locateOnce(page, match, how, tag, inPanel);
  return r === "unmapped" ? null : r;
};

/**
 * Find the first <text> whose content matches (or, with `tag: "title"`, the
 * element whose <title> does: an icon), in any of the editor's system panels.
 */
const locateOnce = (
  page: Page,
  match: string,
  how: "exact" | "endsWith" = "exact",
  tag: "text" | "title" = "text",
  /** Only this panel (by title): the same text can be on two panels. */
  inPanel?: string
): Promise<Located | "unmapped" | null> =>
  page.evaluate(
    ({ match, how, tag, inPanel }) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        shadowRoot: ShadowRoot;
      };
      for (const p of Array.from(
        ed.shadowRoot.querySelectorAll("tosi-b3d-panel")
      ) as Array<
        HTMLElement & {
          svg: SVGSVGElement | null;
          contentToClient(
            x: number,
            y: number
          ): { x: number; y: number } | null;
          clientRect(): DOMRect | null;
        }
      >) {
        const svg = p.svg;
        if (!svg) continue;
        if (inPanel && p.title !== inPanel) continue;
        const hit = Array.from(svg.querySelectorAll(tag)).find((x) => {
          const s = (x.textContent ?? "").trim();
          return how === "exact"
            ? s === match
            : s !== match && s.endsWith(match);
        });
        if (!hit) continue;
        const t = (tag === "title" ? hit.parentElement : hit) as Element;
        // Measure inside the SVG, attached off-screen for a moment.
        const parent = svg.parentNode;
        const next = svg.nextSibling;
        const holder = document.createElement("div");
        holder.style.cssText =
          "position:fixed;left:-20000px;top:0;visibility:hidden;";
        document.body.append(holder);
        holder.append(svg);
        const s = svg.getBoundingClientRect();
        const b = t.getBoundingClientRect();
        const vbH = svg.viewBox.baseVal.height || s.height;
        if (parent) parent.insertBefore(svg, next);
        else svg.remove();
        holder.remove();
        const local = {
          x: b.x - s.x,
          y: b.y - s.y,
          w: b.width,
          h: b.height,
        };
        // Content units -> client pixels, through the drawn plane
        // (tosijs-3d 0.10.13, our #113): drag, scale and title bar included.
        const k = (svg.viewBox.baseVal.width || s.width) / s.width;
        const at = p.contentToClient(local.x * k, local.y * k);
        const end = p.contentToClient(
          (local.x + local.w) * k,
          (local.y + local.h) * k
        );
        const box = p.clientRect();
        // Found, but not mapped (the panel is closed, or in a headset).
        if (!at || !end || !box) return "unmapped" as const;
        return {
          x: at.x,
          y: at.y,
          w: end.x - at.x,
          h: end.y - at.y,
          panelX: box.x,
          panelRight: box.x + box.width,
          inside: local.y >= 0 && local.y + local.h <= vbH,
          panel: { x: box.x + box.width / 2, y: box.y + box.height / 2 },
          title: p.title,
          offCentre: local.y + local.h / 2 - vbH / 2,
        };
      }
      return null;
    },
    { match, how, tag, inPanel }
  );

/**
 * A slider's TRACK on screen (its widest thin rect), found by its caption's
 * prefix, at `fraction` of the way along. `probe` marks the slider's group
 * with `data-probe`, so a test can later ask whether the panel was rebuilt
 * under it (`hasProbe`).
 */
export const sliderTrack = (
  page: Page,
  captionPrefix: string,
  fraction: number,
  probe?: string
): Promise<{ x: number; y: number; width: number } | null> =>
  page.evaluate(
    ({ captionPrefix, fraction, probe }) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        shadowRoot: ShadowRoot;
      };
      for (const p of Array.from(
        ed.shadowRoot.querySelectorAll("tosi-b3d-panel")
      ) as Array<
        HTMLElement & {
          svg: SVGSVGElement | null;
          contentToClient(
            x: number,
            y: number
          ): { x: number; y: number } | null;
          clientRect(): DOMRect | null;
        }
      >) {
        const svg = p.svg;
        if (!svg) continue;
        const caption = Array.from(svg.querySelectorAll("text")).find((t) =>
          (t.textContent ?? "").startsWith(captionPrefix)
        );
        if (!caption) continue;
        let group: Element | null = caption;
        while (group && group.getAttribute?.("data-w3d") !== "slider")
          group = group.parentElement;
        if (!group) continue;
        if (probe) group.setAttribute("data-probe", probe);
        const parent = svg.parentNode;
        const next = svg.nextSibling;
        const holder = document.createElement("div");
        holder.style.cssText =
          "position:fixed;left:-20000px;top:0;visibility:hidden;";
        document.body.append(holder);
        holder.append(svg);
        const s = svg.getBoundingClientRect();
        const bar = Array.from(group.querySelectorAll("rect"))
          .map((r) => r.getBoundingClientRect())
          .filter((b) => b.height > 0 && b.height < 12 && b.width > 20)
          .sort((x, y) => y.width - x.width)[0];
        if (parent) parent.insertBefore(svg, next);
        else svg.remove();
        holder.remove();
        if (!bar) return null;
        const k = (svg.viewBox.baseVal.width || s.width) / s.width;
        const at = p.contentToClient(
          (bar.x - s.x + bar.width * fraction) * k,
          (bar.y - s.y + bar.height / 2) * k
        );
        if (!at) return null;
        return {
          x: at.x,
          y: at.y,
          width: bar.width,
        };
      }
      return null;
    },
    { captionPrefix, fraction, probe }
  );

/** Is the element marked `data-probe` still in a panel's live content? */
export const hasProbe = (page: Page, probe: string) =>
  page.evaluate((probe) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot;
    };
    return Array.from(ed.shadowRoot.querySelectorAll("tosi-b3d-panel")).some(
      (p) =>
        !!(p as HTMLElement & { svg: SVGSVGElement | null }).svg?.querySelector(
          `[data-probe="${probe}"]`
        )
    );
  }, probe);

/** Every <text> in one panel (by title), trimmed: what that panel shows. */
export const panelTexts = (page: Page, title: string) =>
  page.evaluate((title) => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot;
    };
    const p = Array.from(ed.shadowRoot.querySelectorAll("tosi-b3d-panel")).find(
      (x) => (x as HTMLElement).title === title
    ) as (HTMLElement & { svg: SVGSVGElement | null }) | undefined;
    return Array.from(p?.svg?.querySelectorAll("text") ?? []).map((t) =>
      (t.textContent ?? "").trim()
    );
  }, title);

/** Every <text> in every one of the editor's system panels, trimmed. */
export const allPanelTexts = (page: Page) =>
  page.evaluate(() => {
    const ed = document.querySelector("tosi-ensemble-editor") as Element & {
      shadowRoot: ShadowRoot;
    };
    return Array.from(ed.shadowRoot.querySelectorAll("tosi-b3d-panel")).flatMap(
      (p) =>
        Array.from(
          (
            p as HTMLElement & { svg: SVGSVGElement | null }
          ).svg?.querySelectorAll("text") ?? []
        ).map((t) => (t.textContent ?? "").trim())
    );
  });

/**
 * Read the element marked `data-probe` in a panel's content, with the
 * content attached off-screen for the moment (detached, nothing has a style
 * or a size): its visible <text>s, and the width of one part inside it.
 */
export const readProbe = (page: Page, probe: string, part?: string) =>
  page.evaluate(
    ({ probe, part }) => {
      const ed = document.querySelector("tosi-ensemble-editor") as Element & {
        shadowRoot: ShadowRoot;
      };
      for (const p of Array.from(
        ed.shadowRoot.querySelectorAll("tosi-b3d-panel")
      ) as Array<HTMLElement & { svg: SVGSVGElement | null }>) {
        const svg = p.svg;
        const group = svg?.querySelector(`[data-probe="${probe}"]`);
        if (!svg || !group) continue;
        const parent = svg.parentNode;
        const next = svg.nextSibling;
        const holder = document.createElement("div");
        holder.style.cssText = "position:fixed;left:-20000px;top:0;";
        document.body.append(holder);
        holder.append(svg);
        const texts = Array.from(group.querySelectorAll("text"))
          .filter((t) => getComputedStyle(t).display !== "none")
          .map((t) => (t.textContent ?? "").trim());
        const el = part
          ? (group.querySelector(
              `[data-part="${part}"]`
            ) as SVGGraphicsElement | null)
          : null;
        const partWidth =
          el && getComputedStyle(el).display !== "none"
            ? el.getBoundingClientRect().width
            : null;
        if (parent) parent.insertBefore(svg, next);
        else svg.remove();
        holder.remove();
        return { texts, partWidth };
      }
      return null;
    },
    { probe, part }
  );
