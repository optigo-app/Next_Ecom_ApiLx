import fs from "fs";
import path from "path";

const NO_PACKAGE_PAGES = new Set(["procatalog.web"]);

let _pageByDomain = null;

function loadPageByDomain() {
    if (_pageByDomain) return _pageByDomain;
    const map = new Map();
    try {
        const p = path.join(process.cwd(), "app", "(core)", "utils", "ThemeMap.js");
        const content = fs.readFileSync(p, "utf-8");
        const re = /"([a-zA-Z0-9._-]+)"\s*:\s*\{\s*page\s*:\s*"([^"]+)"/g;
        let m;
        while ((m = re.exec(content)) !== null) map.set(m[1].toLowerCase(), m[2]);
    } catch (_) {}
    _pageByDomain = map;
    return map;
}

/**
 * Check point: package-wise filtering is skipped when storeinit.DomainForNo === 2 (main condition).
 * Fallback: tenants whose ThemeMap page is "procatalog.web". The tenant is derived from the open DB file path
 * (db/tenants/<domain>/database.db), so no caller needs to pass anything.
 * @param {import('better-sqlite3').Database} db
 * @returns {boolean}
 */
export function isPackageFilterDisabled(db) {
    try {
        const si = db.prepare("SELECT DomainForNo FROM storeinit LIMIT 1").get();
        if (si && Number(si.DomainForNo) === 2) return true;
    } catch (_) {}
    try {
        const domain = path.basename(path.dirname(String(db?.name || ""))).toLowerCase();
        if (!domain) return false;
        const page = loadPageByDomain().get(domain);
        return !!page && NO_PACKAGE_PAGES.has(page);
    } catch (_) {
        return false;
    }
}
