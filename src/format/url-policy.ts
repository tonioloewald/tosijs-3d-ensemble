/*
  WHAT A SHARED DOCUMENT MAY MAKE A READER'S BROWSER FETCH.

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
