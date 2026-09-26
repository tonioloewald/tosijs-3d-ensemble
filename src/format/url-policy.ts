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
  | `http://localhost/…`         | fine — local development is not the threat |
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
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
const SENTINEL = "relative.invalid";

export interface UrlProblem {
  code: string;
  message: string;
}

export function urlProblem(
  url: string,
  what: "library" | "feature" = "library"
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
  if (parsed.protocol === "http:") {
    if (LOCAL_HOSTS.has(parsed.hostname)) return null;
    return {
      code: `insecure-${what}-url`,
      message: `${what} url "${url}" is http — an ensemble is a document people share, so what it fetches must be served over https (http is allowed only from localhost)`,
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
