import { ensureAlbumsTable, isAlbumUsable } from "../schema/albums.js";

/**
 * Isolated album scoping for the product listing.
 *
 * Listing URL params:
 *   ?album=<RandomNo>            -> products of that single shared album
 *   ?albumScope=all              -> products of every album shared with the same customer
 *
 * The resolver turns those params into `albumAutocodes` (integers) which
 * getDesigns / getFilterList apply as one extra `autocode IN (...)` condition.
 * When no `album` param is present nothing is added, so normal listings are untouched.
 */

const parseCodes = (list) =>
  String(list || "")
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isInteger(n));

/**
 * @param {import('better-sqlite3').Database} db
 * @param {{ album?: string, albumScope?: string, viewerCustomerId?: number|string }} opts
 * @returns {{ active: boolean, autocodes: number[], scope: "one"|"all", blockedStatus?: string }}
 */
export function resolveAlbumScope(db, opts = {}) {
  const key = String(opts.album ?? "").trim();
  if (!db || !key) return { active: false, autocodes: [], scope: "one" };

  ensureAlbumsTable(db);
  const scope = String(opts.albumScope || "").toLowerCase() === "all" ? "all" : "one";

  // The album key is whatever identifier is in the URL: share RandomNo first,
  // then albumcode, then numeric album id (seeded albums may have no share key).
  let matched = db.prepare("SELECT * FROM albums WHERE RandomNo = ? LIMIT 1").get(key)
    || db.prepare("SELECT * FROM albums WHERE LOWER(albumcode) = LOWER(?) ORDER BY rowid DESC LIMIT 1").get(key)
    || (/^\d+$/.test(key) ? db.prepare("SELECT * FROM albums WHERE id = ? ORDER BY rowid DESC LIMIT 1").get(Number(key)) : null);
  if (!matched) return { active: true, autocodes: [], scope, blockedStatus: "missing" };

  if (scope === "one") {
    if (!isAlbumUsable(matched)) {
      return {
        active: true,
        autocodes: [],
        scope,
        blockedStatus: Number(matched.IsDeactive) === 1 ? "deactivated" : "expired",
      };
    }
    return { active: true, autocodes: [...new Set(parseCodes(matched.AutocodeList))], scope };
  }

  // scope = all: every album shared with the viewer (logged in) or with the
  // customer the shared link belongs to (guest). Newest share row per album id.
  const owner = Number(opts.viewerCustomerId) || Number(matched.CustomerId) || 0;
  if (!owner) {
    return { active: true, autocodes: [...new Set(parseCodes(matched.AutocodeList))], scope };
  }
  const rows = db
    .prepare("SELECT rowid AS _rowid, * FROM albums WHERE CustomerId = ? AND CAST(COALESCE(NULLIF(TRIM(AlbumSecurityId), ''), '0') AS INTEGER) <> 1")
    .all(owner);
  const latest = new Map();
  for (const r of rows) {
    const prev = latest.get(r.id);
    if (!prev || r._rowid >= prev._rowid) latest.set(r.id, r);
  }
  const codes = new Set();
  for (const r of latest.values()) {
    if (isAlbumUsable(r)) parseCodes(r.AutocodeList).forEach((c) => codes.add(c));
  }
  return { active: true, autocodes: [...codes], scope };
}

/**
 * Builds the SQL condition fragment for resolved album autocodes.
 * Returns null when the filters carry no album scope (no-op).
 * @param {{ albumScopeActive?: boolean, albumAutocodes?: number[] }} filters
 */
export function buildAlbumCondition(filters = {}) {
  if (!filters.albumScopeActive) return null;
  const codes = (filters.albumAutocodes || []).map(Number).filter(Number.isInteger);
  if (codes.length === 0) return "1 = 0";
  return `CAST(autocode AS INTEGER) IN (${codes.join(",")})`;
}

/**
 * Mutates a filters object: resolves `album`/`albumScope` into albumScopeActive + albumAutocodes.
 */
export function applyAlbumScope(db, filters, viewerCustomerId) {
  const album = filters?.album ?? filters?.Album;
  if (!album) return filters;
  const res = resolveAlbumScope(db, {
    album,
    albumScope: filters.albumScope ?? filters.AlbumScope,
    viewerCustomerId,
  });
  filters.albumScopeActive = res.active;
  filters.albumAutocodes = res.autocodes;
  return filters;
}

export default resolveAlbumScope;
