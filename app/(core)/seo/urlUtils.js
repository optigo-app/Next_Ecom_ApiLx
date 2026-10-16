import pako from "pako";

/**
 * Validates and converts website string to a safe URL object
 * @param {string} website
 * @returns {URL|undefined}
 */
export function getValidUrl(website) {
  if (!website) return undefined;
  try {
    return new URL(website);
  } catch {
    try {
      return new URL(`https://${website}`);
    } catch {
      return undefined;
    }
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
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "");
  return `${baseUrl}${cleanPath}`;
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
