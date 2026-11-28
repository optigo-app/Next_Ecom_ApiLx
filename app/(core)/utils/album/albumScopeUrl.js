export const ALBUM_PARAM = "album";
export const ALBUM_SCOPE_PARAM = "albumScope";

/**
 * Reads the album scope from the current URL as a filter payload fragment.
 * Returns {} when no album is in the URL, so spreading it is a no-op for normal listings.
 */
export function readAlbumScopeFromUrl() {
  if (typeof window === "undefined") return {};
  const qs = new URLSearchParams(window.location.search);
  const album = qs.get(ALBUM_PARAM);
  if (!album) return {};
  return { album, albumScope: qs.get(ALBUM_SCOPE_PARAM) === "all" ? "all" : "one" };
}

/**
 * Listing URL for an album. Accepts an album row (uses RandomNo, then
 * albumcode, then id — whichever exists) or a raw key string.
 */
export function buildAlbumListingUrl(albumOrKey, scope = "one") {
  const key =
    typeof albumOrKey === "object" && albumOrKey !== null
      ? (albumOrKey.RandomNo || albumOrKey.albumcode || albumOrKey.id || "")
      : albumOrKey;
  if (!key && key !== 0) return "/p";
  const qs = new URLSearchParams({ [ALBUM_PARAM]: String(key) });
  if (scope === "all") qs.set(ALBUM_SCOPE_PARAM, "all");
  return `/p?${qs.toString()}`;
}
