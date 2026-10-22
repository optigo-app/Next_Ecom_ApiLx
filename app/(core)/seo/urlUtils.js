import pako from "pako";

/**
 * Validates and converts website string to a safe URL object
 * @param {string} website
 * @returns {URL|undefined}
 */
export function getValidUrl(website) {
  if (!website) return undefined;
  const value = String(website).trim();
  if (!value) return undefined;
  try {
    // A bare host can contain a port (localhost:8012), which `new URL()`
    // otherwise mistakes for a custom URL scheme.
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value.replace(/^\/\//, "")}`);
  } catch {
    return undefined;
  }
}

/**
 * Generates a clean Canonical URL by stripping query parameters and trailing slash
 * @param {string} baseUrl
 * @param {string} pathname
 * @returns {string|null}
 */
export function getCanonicalUrl(baseUrl, pathname) {
  if (!baseUrl || !pathname) return null;
  try {
    const base = getValidUrl(baseUrl);
    if (!base) return null;

    // Framework headers can contain either a path or an absolute request URL.
    // Keep the canonical origin from baseUrl and discard query/hash data.
    const requestUrl = new URL(String(pathname), base);
    const cleanPath = requestUrl.pathname.replace(/\/$/, "");
    return `${base.origin}${cleanPath}`;
  } catch {
    return null;
  }
}

/**
 * Decompresses and decodes URL-safe base64 compressed data payloads (pako / gzip)
 * @param {string} encodedString
 * @returns {object|null}
 */
export function decodeAndDecompress(encodedString) {
  try {
    if (!encodedString) return null;

    let str = encodedString;
    if (typeof str === "string" && str.includes("%")) {
      try {
        str = decodeURIComponent(str);
      } catch (_) {}
    }

    // 1. Sanitize common URL transmission corruptions
    let sanitized = str.replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");

    // 2. Decode to a binary buffer
    const buffer = Buffer.from(sanitized, "base64");

    // 3. Decompress the binary data with pako
    const decompressedUint8 = pako.inflate(buffer);

    // 4. Convert back to string and parse JSON
    const decompressedString = new TextDecoder().decode(decompressedUint8);
    return JSON.parse(decompressedString);
  } catch (error) {
    console.error("SEO urlUtils: Decompression error:", error?.message || error);
    return null;
  }
}
