import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".next_cache");
const MENU_CACHE_DIR = path.join(CACHE_DIR, "menu");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
if (!fs.existsSync(MENU_CACHE_DIR)) fs.mkdirSync(MENU_CACHE_DIR, { recursive: true });

const defaultTTL = 12 * 60 * 60 * 1000; // 12h
const safeKey = (key) => key.replace(/[^a-zA-Z0-9_\-]/g, "_");

const resolveCacheFilePath = (key) => {
  if (key.startsWith("menu/")) {
    const cleanKey = safeKey(key.replace("menu/", ""));
    return path.join(MENU_CACHE_DIR, `${cleanKey}.json`);
  }
  return path.join(CACHE_DIR, `${safeKey(key)}.json`);
};

const isErrorPayload = (data) => {
  if (!data) return true;
  if (Array.isArray(data)) {
    if (data.length === 0) return false;
    return data.some(
      (item) =>
        item?.stat === 0 ||
        (typeof item?.stat_msg === "string" &&
          item.stat_msg.toLowerCase().includes("network error")),
    );
  }
  if (typeof data === "object") {
    if (data?.stat === 0) return true;
    if (
      Array.isArray(data?.rd) &&
      data.rd.some((item) => item?.stat === 0)
    )
      return true;
    if (
      Array.isArray(data?.Data?.rd) &&
      data.Data.rd.some((item) => item?.stat === 0)
    )
      return true;
  }
  return false;
};

export async function setCache(key, data, meta) {
  if (isErrorPayload(data)) {
    console.warn(`⚠️ [CACHE WRITE ABORTED - ERROR DATA] ${key}`);
    return;
  }

  const now = Date.now();
  const file = resolveCacheFilePath(key);
  const payload = {
    timestamp: now,
    meta,
    data,
  };

  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    // Optimization: Remove pretty-printing (null, 2) to reduce file size and I/O
    await fs.promises.writeFile(file, JSON.stringify(payload), "utf8");
    console.log(`✅ [CACHE SAVED] ${key}`);
  } catch (err) {
    console.error(`❌ Cache write failed for ${key}:`, err);
  }
}

export async function getCache(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = resolveCacheFilePath(key);

  try {
    // Optimization: Use asynchronous readFile instead of synchronous readFileSync
    const content = await fs.promises.readFile(file, "utf8");
    const cached = JSON.parse(content);

    if (isErrorPayload(cached?.data)) {
      console.warn(`⚠️ [CACHE INVALIDATED - CONTAINS ERROR DATA] ${key}`);
      fs.promises.unlink(file).catch(() => {});
      return null;
    }

    if (now - cached.timestamp < ttlMs) {
      // console.log(`💾 [CACHE HIT - DISK] ${key}`);
      return cached.data;
    }
    console.log(`⏰ [CACHE EXPIRED] ${key}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`⚠️ Error reading/parsing cache file for ${key}:`, err.message);
      // fs.promises.unlink(file).catch(() => {});
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}

// Get cache with full metadata (for CacheRebuildDate comparison)
export async function getCacheWithMeta(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);

  try {
    // Optimization: Use asynchronous readFile instead of synchronous readFileSync
    const content = await fs.promises.readFile(file, "utf8");
    const cached = JSON.parse(content);
    if (isErrorPayload(cached?.data)) {
      console.warn(`⚠️ [CACHE INVALIDATED WITH META - CONTAINS ERROR DATA] ${key}`);
      fs.promises.unlink(file).catch(() => {});
      return null;
    }
    if (now - cached.timestamp < ttlMs) {
      console.log(`💾 [CACHE HIT WITH META] ${key}`);
      return {
        data: cached.data,
        meta: cached.meta || {},
        timestamp: cached.timestamp,
        CacheRebuildDate: cached.meta?.CacheRebuildDate ?? null,
      };
    }
    console.log(`⏰ [CACHE EXPIRED] ${key}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`⚠️ Error reading cache with meta for ${key}:`, err.message);
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}


// --- DASHBOARD RECURSIVE CACHE FUNCTIONS ---

async function getFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? getFilesRecursive(fullPath) : fullPath;
      })
    );
    return Array.prototype.concat(...files);
  } catch (e) {
    return [];
  }
}

export async function getAllCachedItems() {
  if (!fs.existsSync(CACHE_DIR)) return [];

  try {
    const allFiles = await getFilesRecursive(CACHE_DIR);
    const items = [];

    for (const filePath of allFiles) {
      if (!filePath.endsWith(".json")) continue;

      try {
        const stats = await fs.promises.stat(filePath);
        const content = await fs.promises.readFile(filePath, "utf8");
        const json = JSON.parse(content);
        const relPath = path.relative(CACHE_DIR, filePath).replace(/\\/g, "/");

        let category = "General";
        if (relPath.startsWith("menu/")) category = "Menu";
        else if (relPath.includes("storeInit")) category = "StoreInit";
        else if (relPath.includes("pl_") || relPath.includes("pd_")) category = "Product";

        items.push({
          fileName: relPath,
          originalKey: json.key || relPath.replace(".json", ""),
          timestamp: json.timestamp,
          size: (stats.size / 1024).toFixed(2) + " KB",
          meta: { ...(json.meta || {}), category },
          expiresAt: json.timestamp + defaultTTL,
          isExpired: Date.now() > (json.timestamp + defaultTTL),
        });
      } catch (err) {
        console.warn(`Skipping corrupt cache file: ${filePath}`);
      }
    }

    // Sort by newest first
    return items.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error("Error listing all cached items:", err);
    return [];
  }
}

export async function clearCache(key) {
  try {
    let file = resolveCacheFilePath(key);
    if (!fs.existsSync(file)) {
      const filename = key.endsWith(".json") ? key : `${safeKey(key)}.json`;
      file = path.join(CACHE_DIR, filename);
    }

    if (fs.existsSync(file)) {
      await fs.promises.unlink(file);
      console.log(`🗑️ [CACHE CLEARED] ${key}`);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function clearAllCache() {
  if (fs.existsSync(CACHE_DIR)) {
    try {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      fs.mkdirSync(MENU_CACHE_DIR, { recursive: true });
      console.log("🗑️ Cleared and recreated all cache directories recursively");
    } catch (err) {
      console.error("Error clearing all cache:", err);
    }
  }
}