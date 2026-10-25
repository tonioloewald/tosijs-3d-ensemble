/*
  WHAT A SHARED DOCUMENT MAY MAKE A READER'S BROWSER FETCH.

  The document's urls — its libraries and its features' fetched fields. Not
  the `<tosi-ensemble src>` a page author writes: that is the page's choice
  about which document to load, not the document's choice about the reader.

  One rule, used in two places that must never disagree: `validate`, which
  REPORTS a bad url, and the loaders (`mountLibraries`, the scene features'
  binds), which REFUSE to fetch one. The 0.4.0 review found the rule existed
  only in the first — every loader fetched before `validate` ever ran — so a
  document could still point a reader at any host while the changelog said it
  could not.

  | url                          | verdict                                   |
  | ---------------------------- | ----------------------------------------- |
  | `https://…`                  | fine                                      |
  | `/kits/x.glb`, `./x.glb`     | fine — relative, it inherits the page     |
  | `https://localhost/…`        | fine — https, like any other host         |
  | `http://localhost/…`         | insecure — see below                      |
  | `http://cdn.example/…`       | insecure                                  |
  | `//cdn.example/…`            | unsupported — another host, scheme unsaid |
  | anything else                | unsupported scheme                        |

  ⚠️ CLASSIFIED THE WAY THE BROWSER WILL PARSE IT, not by reading the string.
  The first version tested the raw string for a leading scheme, and the WHATWG
  parser — which fetch and the loaders use — strips leading spaces and control
  characters and deletes tabs and newlines anywhere. So `" http://evil…"` and
  `"java\nscript:alert(1)"` looked scheme-less, were called relative, and passed.
  Resolving against TWO sentinel bases, one http and one https, answers the
  only question that matters: did the scheme come from the url or from the
  page? If it came from the page, the url is relative — unless it also names
  another host, which is what `//evil.example` does.

  `blob:` is deliberately not allowed: no library url is ever a blob today, and
  admitting a scheme "just in case" is how an allow-list stops being one.
*/
const SENTINEL = "relative.invalid";

export interface UrlProblem {
  code: string;
  message: string;
}

export function urlProblem(
  url: string,
  what: "library" | "feature" | "nested" = "library"
): UrlProblem | null {
  // Fail closed: a url field that holds something else is refused, not
  // stringified and hoped about (`new URL(["http://x"])` fetches http://x).
  if (typeof url !== "string")
    return {
      code: `unsupported-${what}-url`,
      message: `${what} url is ${
        Array.isArray(url) ? "an array" : `a ${typeof url}`
      }, not a url string`,
    };
  let viaHttps: URL;
  let viaHttp: URL;
  try {
    viaHttps = new URL(url, `https://${SENTINEL}/`);
    viaHttp = new URL(url, `http://${SENTINEL}/`);
  } catch {
    return {
      code: `unsupported-${what}-url`,
      message: `${what} url "${url}" is not a valid url`,
    };
  }

  // The scheme came from the PAGE, so the url did not state one.
  if (viaHttps.protocol !== viaHttp.protocol) {
    if (viaHttps.hostname === SENTINEL) return null; // genuinely relative
    return {
      code: `unsupported-${what}-url`,
      message: `${what} url "${url}" names another host without a scheme — write https:// explicitly, so it cannot become plain http on an http page`,
    };
  }

  const parsed = viaHttps;
  if (parsed.protocol === "https:") return null;
  /*
    NO LOCALHOST EXEMPTION. There was one — "local development is not the
    threat" — and the 0.4.0 review confirmed what it actually did: it applied
    on EVERY page, so a document opened on a public site could send plaintext
    GETs to the reader's own machine (`http://localhost:9200/_shutdown`,
    `http://127.1/`, `http://0x7f000001/` all normalise to loopback, and mixed
    content blocking does not cover loopback). Local development never needed
    it: relative urls and `https://localhost` both pass. Owner's call, 0.4.0.
  */
  if (parsed.protocol === "http:") {
    return {
      code: `insecure-${what}-url`,
      message: `${what} url "${url}" is http — an ensemble is a document people share, so what it fetches must be served over https — use a relative url or https://localhost for local development`,
    };
  }
  return {
    code: `unsupported-${what}-url`,
    message: `${what} url "${url}" uses "${parsed.protocol}" — only https (and relative urls) are supported, so that a shared ensemble cannot choose what a reader's browser executes or fetches`,
  };
}

/**
 * Why a FETCHED field's value is not acceptable, or `null`.
 *
 * ⚠️ FAILS CLOSED, and that is the whole point of it being one function. The
 * rule needed three review passes because each check was keyed on "is it a
 * string": a value that was not one was treated as "not a url" and skipped —
 * and `["http://evil…"]` is valid JSON that the element `String()`s straight
 * back into a url and fetches. So for a field known to be FETCHED:
 *
 * - absent, `null` or `""` means none, and is fine;
 * - a string is a keyword (`checker`) or goes through `urlProblem`;
 * - ANYTHING ELSE is refused. A fetched field has no business holding an
 *   array, an object or a number, and guessing what the consumer will make of
 *   one is how the bypass happened.
 *
 * `validate` (to report) and `declaredConfig` (to refuse) both call this, so
 * the two can no longer drift apart — they had, into two copies of the bug.
 */
export function fetchedValueProblem(
  value: unknown,
  keywords: ReadonlySet<string> = new Set()
): UrlProblem | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string")
    return keywords.has(value) ? null : urlProblem(value, "feature");
  return {
    code: "unsupported-feature-url",
    message: `a fetched field holds ${
      Array.isArray(value) ? "an array" : `a ${typeof value}`
    }, not a url string — refused rather than guessed at, because the element would stringify it and fetch the result`,
  };
}

/** A fetched value inside structured data, and where it is. */
export interface DeepUrlProblem extends UrlProblem {
  /** JSON-pointer path below the field, `""` for the field itself. */
  path: string;
}

type Node = Record<string, unknown>;

/**
 * FETCHED STRINGS INSIDE STRUCTURED DATA, found by the data's own schema.
 *
 * A top-level field is fetched when its schema says `format:
 * 'uri-reference'`. An effect `recipe` is an object whose layers carry a
 * particle `texture` and a sound `url` (tosijs-3d#120, ours), so the same
 * rule has to reach INTO it. This walks a value against its schema, never
 * against field names it knows: `$ref` into the root's `$defs`, `properties`,
 * `items`, and `anyOf` / `oneOf` / `allOf`.
 *
 * Unions err STRICT. Where a value could be more than one branch (a layer is
 * `oneOf` by kind), every branch is followed, so a string that ANY branch
 * says is fetched is held to the rule. A STRING meeting an `anyOf` of forms
 * is the exception that needs telling apart: a particle `texture` is a URI
 * or inline SVG markup (`x-inline`), split by `pattern`, and markup is drawn
 * as an image and fetches nothing. A string matching no form is refused.
 *
 * ONE walk, two uses (#3439): `deepFetchedProblems` reports, `rewriteFetched`
 * rebases. They were two copies of this, and the copies had drifted: the
 * rewrite ignored `x-keywords`, so a keyword would have been rebased as if it
 * were a url.
 */
type Leaf = { keywords: ReadonlySet<string> } | "unmatched";

function walkFetched(
  schema: unknown,
  value: unknown,
  visit: (value: unknown, path: string, leaf: Leaf) => unknown,
  root: unknown = schema
): unknown {
  const defs = ((root as Node)?.$defs ?? {}) as Record<string, unknown>;
  const resolve = (s: unknown, seen = 0): Node | null => {
    if (!s || typeof s !== "object" || seen > 16) return null;
    const ref = (s as Node).$ref;
    if (typeof ref === "string" && ref.startsWith("#/$defs/")) {
      const target = defs[ref.slice("#/$defs/".length)];
      return target
        ? resolve({ ...(target as Node), ...omitRef(s as Node) }, seen + 1)
        : (s as Node);
    }
    return s as Node;
  };
  const matches = (branch: Node, text: string): boolean => {
    const own =
      typeof branch.pattern === "string"
        ? new RegExp(branch.pattern).test(text)
        : true;
    const not = branch.not as Node | undefined;
    const negated =
      not && typeof not.pattern === "string"
        ? !new RegExp(not.pattern).test(text)
        : true;
    return own && negated;
  };
  const walk = (
    raw: unknown,
    v: unknown,
    path: string,
    depth: number
  ): unknown => {
    const s = resolve(raw);
    if (!s || depth > 32 || v === undefined || v === null) return v;
    let out: unknown = v;
    if (s.format === "uri-reference") {
      out = visit(out, path, {
        keywords: new Set((s["x-keywords"] as string[]) ?? []),
      });
      // Visited: a union branch saying uri as well must not visit it again,
      // or a rebase runs twice (`/child//child/a.png`, #3495).
      if (typeof out === "string") return out;
    }
    const union = [
      ...((s.anyOf as unknown[]) ?? []),
      ...((s.oneOf as unknown[]) ?? []),
    ]
      .map((b) => resolve(b))
      .filter((b): b is Node => !!b);
    if (typeof out === "string" && union.length) {
      const forms = union.filter(
        (b) =>
          b.pattern !== undefined ||
          b.not !== undefined ||
          b.format !== undefined ||
          b["x-inline"] !== undefined
      );
      if (forms.length) {
        const text = out;
        const chosen = forms.find((b) => matches(b, text));
        if (!chosen) return visit(out, path, "unmatched");
        return chosen["x-inline"] ? out : walk(chosen, out, path, depth + 1);
      }
    }
    for (const b of [...union, ...((s.allOf as unknown[]) ?? [])])
      out = walk(b, out, path, depth + 1);
    if (Array.isArray(out) && s.items) {
      const items = out.map((item, i) =>
        walk(s.items, item, `${path}/${i}`, depth + 1)
      );
      if (items.some((item, i) => item !== (out as unknown[])[i])) out = items;
    } else if (
      out &&
      typeof out === "object" &&
      !Array.isArray(out) &&
      s.properties
    ) {
      const props = s.properties as Record<string, unknown>;
      let copy: Node | null = null;
      for (const [k, child] of Object.entries(out as Node)) {
        if (!props[k]) continue;
        const next = walk(props[k], child, `${path}/${k}`, depth + 1);
        if (next !== child) (copy ??= { ...(out as Node) })[k] = next;
      }
      if (copy) out = copy;
    }
    return out;
  };
  return walk(schema, value, "", 0);
}

/** Every fetched string in `value` the url rule refuses, with its path. */
export function deepFetchedProblems(
  schema: unknown,
  value: unknown,
  root: unknown = schema
): DeepUrlProblem[] {
  const out: DeepUrlProblem[] = [];
  walkFetched(
    schema,
    value,
    (v, path, leaf) => {
      const problem =
        leaf === "unmatched"
          ? {
              code: "unsupported-feature-url",
              message: `"${String(v).slice(
                0,
                40
              )}" is none of the forms this field takes`,
            }
          : fetchedValueProblem(v, leaf.keywords);
      if (problem) out.push({ ...problem, path });
      return v;
    },
    root
  );
  // A union walks one value down several branches; say each problem once.
  const seen = new Set<string>();
  return out.filter(
    (p) => !seen.has(p.path + p.code) && !!seen.add(p.path + p.code)
  );
}

/**
 * `value` with every FETCHED string in it (keywords excepted) passed through
 * `fn`. Copy on write: `value` is not changed. A nested child's recipe uses
 * this to rebase its relative urls onto the child's own.
 */
export function rewriteFetched(
  schema: unknown,
  value: unknown,
  fn: (url: string) => string,
  root: unknown = schema
): unknown {
  return walkFetched(
    schema,
    value,
    (v, _path, leaf) =>
      typeof v === "string" && leaf !== "unmatched" && !leaf.keywords.has(v)
        ? fn(v)
        : v,
    root
  );
}

const omitRef = (s: Node): Node => {
  const { $ref: _ref, ...rest } = s;
  return rest;
};
