import fs from "fs";
import path from "path";
import { getTenantDb } from "../../../../db/tenantManager.js";
import { getWebsiteColor } from "../../../../db/procedures/getWebsiteColor.js";
import { getDomainInfo } from "../getDomainInfo.js";
import { logger } from "../../../../db/logger.js";

const CACHE_DIR = path.join(process.cwd(), ".next_cache", "website_color");

function safeDomain(domain) {
  if (!domain || typeof domain !== "string") return "default";
  return domain.trim().toLowerCase().split(":")[0].replace(/[^a-zA-Z0-9._-]/g, "_");
}

function resolveCacheFilePath(domain) {
  return path.join(CACHE_DIR, `${safeDomain(domain)}.json`);
}

/**
 * Writes website color config to disk cache safely via temp atomic write.
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
    await fs.promises.writeFile(tempPath, JSON.stringify(payload, null, 2), "utf8");
    await fs.promises.rename(tempPath, filePath);
  } catch (err) {
    await fs.promises.unlink(tempPath).catch(() => {});
    console.warn(`[WebsiteColorCache] Failed to write disk cache for ${domain}:`, err.message);
  }
}

/**
 * Invalidate / clear cache for a domain (or all domains).
 *
 * @param {string} [domain]
 */
export async function invalidateWebsiteColorCache(domain) {
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
 * Reads the latest color configuration from SQLite and writes the updated JSON file to disk.
 * Call this right after new data is saved into SQLite.
 *
 * @param {string} [domain]
 * @returns {Promise<object|null>} The newly generated color configuration object
 */
export async function syncAndRefreshWebsiteColorCache(domain) {
  let targetDomain = domain;
  if (!targetDomain) {
    const domainInfo = await getDomainInfo().catch(() => ({}));
    targetDomain = domainInfo?.hostname || "default";
  }
  targetDomain = String(targetDomain).trim().split(":")[0];

  const db = getTenantDb(targetDomain);
  if (!db) {
    logger.warn("WEBSITE_COLOR_CONFIG", `Tenant database not found for '${targetDomain}' during cache refresh`);
    return null;
  }

  // Fetch website color config from SQLite
  const result = getWebsiteColor(db, {
    domain: targetDomain,
  });

  const rows = result?.Data?.rd || [];
  const colorData = rows[0] || null;

  // Refresh the diagnostic JSON snapshot on disk
  await writeDiskCache(targetDomain, colorData);

  logger.info("WEBSITE_COLOR_CONFIG", `Updated SQLite website color synced to JSON file cache for '${targetDomain}'`);
  return colorData;
}

/**
 * Main method: Fetches the latest website color/theme configuration.
 * Fast direct query from SQLite with disk snapshot maintenance.
 *
 * @param {object} [options={}]
 * @param {string} [options.domain] - Tenant domain
 * @param {number|string} [options.store_id] - Optional store_id filter
 * @returns {Promise<{ success: boolean, domain: string, source: "sqlite"|"error", data: object|null, error?: string }>}
 */
export async function getWebsiteColorConfig(options = {}) {
  let targetDomain = options.domain;
  if (!targetDomain) {
    const domainInfo = await getDomainInfo().catch(() => ({}));
    targetDomain = domainInfo?.hostname || "default";
  }
  targetDomain = String(targetDomain).trim().split(":")[0];

  const db = getTenantDb(targetDomain);
  if (!db) {
    logger.warn("WEBSITE_COLOR_CONFIG", `Tenant database not found for '${targetDomain}'`);
    return {
      success: false,
      domain: targetDomain,
      source: "error",
      error: `Tenant database not found for domain '${targetDomain}'`,
      data: null,
    };
  }

  const result = getWebsiteColor(db, {
    domain: targetDomain,
    store_id: options.store_id,
  });

  const rows = result?.Data?.rd || [];
  const colorData = rows[0] || null;

  // Maintain the disk JSON snapshot
  await writeDiskCache(targetDomain, colorData);

  return {
    success: true,
    domain: targetDomain,
    source: "sqlite",
    data: colorData,
  };
}
