import fs from "fs";
import path from "path";
import { BANNER_TYPES } from "../../constants/BANNER_TYPES.js";
import { getTenantDb } from "../../../../db/tenantManager.js";
import { getWebsiteContent } from "../../../../db/procedures/getWebsiteContent.js";
import { getDomainInfo } from "../getDomainInfo.js";
import { logger } from "../../../../db/logger.js";

const CACHE_DIR = path.join(process.cwd(), ".next_cache", "website_content");

// Fast lookup map for banner types
const BANNER_TYPE_MAP = new Map(
  BANNER_TYPES.map((item) => [Number(item.BannerTypeId), item])
);

function safeDomain(domain) {
  if (!domain || typeof domain !== "string") return "default";
  return domain.trim().toLowerCase().split(":")[0].replace(/[^a-zA-Z0-9._-]/g, "_");
}

function resolveCacheFilePath(domain) {
  return path.join(CACHE_DIR, `${safeDomain(domain)}.json`);
}

function parseJsonSafely(val) {
  if (!val) return null;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (_) {
      return val;
    }
  }
  return val;
}

/**
 * Transforms raw website_content rows into a structured, grouped configuration.
 *
 * Structure:
 * {
 *   banner: {
 *     config: { activeBannerTypeIds: [1, 8], ... },
 *     banners: [ ...all banner items with TypeKey and TypeName... ],
 *     byType: {
 *       HomepageSlider: [ ... ],
 *       PromotionalBanner: [ ... ]
 *     }
 *   },
 *   branding: [ ... ],
 *   collectionconfig: [ ... ],
 *   pagetemplate: [ ... ],
 *   categoryconfig: [ ... ],
 *   seo: [ ... ],
 *   themesetting: [ ... ],
 *   ...other content types
 * }
 */
export function groupWebsiteContent(rows = []) {
  const grouped = {};
  const bannerList = [];
  let bannerConfigObj = null;

  for (const row of rows) {
    if (!row) continue;
    const contentTypeRaw = (row.ContentType || "other").trim().toLowerCase();

    // Parse ContentJson if present
    const item = {
      ...row,
      ContentJson: parseJsonSafely(row.ContentJson),
    };

    if (contentTypeRaw === "bannerconfig") {
      bannerConfigObj = item.ContentJson || item;
    } else if (contentTypeRaw === "banner") {
      const bannerTypeId = Number(item.BannerTypeId);
      const meta = BANNER_TYPE_MAP.get(bannerTypeId);
      const bannerItem = {
        ...item,
        TypeKey: meta?.TypeKey || null,
        TypeName: meta?.TypeName || null,
        BannerMeta: meta || null,
      };
      bannerList.push(bannerItem);
    } else {
      if (!grouped[contentTypeRaw]) {
        grouped[contentTypeRaw] = [];
      }
      grouped[contentTypeRaw].push(item);
    }
  }

  // Group banners by TypeKey
  const bannersByType = {};
  for (const b of bannerList) {
    const key = b.TypeKey || (b.BannerTypeId ? `BannerType_${b.BannerTypeId}` : "OtherBanners");
    if (!bannersByType[key]) {
      bannersByType[key] = [];
    }
    bannersByType[key].push(b);
  }

  // Banner group containing banner config and all main banners
  grouped.banner = {
    config: bannerConfigObj,
    banners: bannerList,
    byType: bannersByType,
  };

  return grouped;
}

/**
 * Writes website config to disk cache safely.
 */
async function writeDiskCache(domain, data) {
  const filePath = resolveCacheFilePath(domain);
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const payload = {
      domain,
      timestamp: Date.now(),
      data,
    };
    await fs.promises.writeFile(tempPath, JSON.stringify(payload), "utf8");
    await fs.promises.rename(tempPath, filePath);
  } catch (err) {
    await fs.promises.unlink(tempPath).catch(() => {});
    console.warn(`[WebsiteContentCache] Failed to write disk cache for ${domain}:`, err.message);
  }
}

/**
 * Invalidate / clear cache for a domain (or all domains).
 *
 * @param {string} [domain]
 */
export async function invalidateWebsiteContentCache(domain) {
  if (domain) {
    const filePath = resolveCacheFilePath(domain);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (_) {}
  } else {
    try {
      if (fs.existsSync(CACHE_DIR)) {
        await fs.promises.rm(CACHE_DIR, { recursive: true, force: true });
      }
    } catch (_) {}
  }
}

/**
 * Reads the latest data from SQLite and immediately writes the updated grouped JSON file to disk and memory.
 * Call this right after new data is saved into SQLite.
 *
 * @param {string} [domain]
 * @returns {Promise<object>} The newly generated grouped configuration
 */
export async function syncAndRefreshWebsiteContentCache(domain) {
  let targetDomain = domain;
  if (!targetDomain) {
    const domainInfo = await getDomainInfo().catch(() => ({}));
    targetDomain = domainInfo?.hostname || "default";
  }
  const db = getTenantDb(targetDomain);
  if (!db) {
    logger.warn("WEBSITE_CONTENT_CONFIG", `Tenant database not found for '${targetDomain}' during cache refresh`);
    return null;
  }

  // Fetch all active website content from SQLite
  const result = getWebsiteContent(db, {
    domain: targetDomain,
    isActive: true,
  });

  const rows = result?.Data?.rd || [];
  const groupedData = groupWebsiteContent(rows);

  // Refresh the diagnostic JSON snapshot from the database.
  await writeDiskCache(targetDomain, groupedData);

  logger.info("WEBSITE_CONTENT_CONFIG", `Updated SQLite content synced to JSON file cache for '${targetDomain}'`);
  return groupedData;
}


/**
 * Main method: Fetches the latest website content grouped by ContentType.
 * SQLite is authoritative; the disk JSON snapshot is never used to serve requests.
 *
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {boolean} [options.bypassCache] - Retained for API compatibility; SQLite is always queried.
 * @returns {Promise<{ success: boolean, domain: string, source: "sqlite", data: Record<string, any> }>}
 */
export async function getGroupedWebsiteConfig(options = {}) {
  let targetDomain = options.domain;
  if (!targetDomain) {
    const domainInfo = await getDomainInfo().catch(() => ({}));
    targetDomain = domainInfo?.hostname || "default";
  }
  // SQLite is authoritative. Memory/disk snapshots can be stale when a push is
  // handled by another server process, so they are never used to serve requests.
  // Keep writing the disk snapshot for diagnostics and offline inspection only.
  const db = getTenantDb(targetDomain);
  if (!db) {
    logger.warn("WEBSITE_CONTENT_CONFIG", `Tenant database not found for '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      source: "error",
      error: `Tenant database not found for domain '${targetDomain}'`,
      data: {},
    };
  }

  const result = getWebsiteContent(db, {
    domain: targetDomain,
    isActive: true,
  });

  const rows = result?.Data?.rd || [];
  const groupedData = groupWebsiteContent(rows);

  // Refresh the diagnostic JSON snapshot from the database.
  await writeDiskCache(targetDomain, groupedData);

  return {
    success: true,
    domain: targetDomain,
    source: "sqlite",
    data: groupedData,
  };
}
