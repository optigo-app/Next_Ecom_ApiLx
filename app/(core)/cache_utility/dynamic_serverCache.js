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

export async function setCache(key, data, meta) {
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


// --- NEW FUNCTIONS FOR DASHBOARD ---

export async function getAllCachedItems() {
  if (!fs.existsSync(CACHE_DIR)) return [];

  try {
    const files = await fs.promises.readdir(CACHE_DIR);
    const items = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(CACHE_DIR, file);
      try {
        const stats = await fs.promises.stat(filePath);
        const content = await fs.promises.readFile(filePath, "utf8");
        const json = JSON.parse(content);

        items.push({
          fileName: file,
          originalKey: json.key || file.replace(".json", ""), // Fallback if key wasn't saved
          timestamp: json.timestamp,
          size: (stats.size / 1024).toFixed(2) + " KB", // Size in KB
          meta: json.meta || {},
          expiresAt: json.timestamp + defaultTTL,
          isExpired: Date.now() > (json.timestamp + defaultTTL)
        });
      } catch (err) {
        console.warn(`Skipping corrupt cache file: ${file}`);
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
  // We accept either the original key or the filename
  let filename = key.endsWith(".json") ? key : `${safeKey(key)}.json`;
  const file = path.join(CACHE_DIR, filename);

  try {
    await fs.promises.unlink(file);
    console.log(`🗑️ [CACHE CLEARED] ${key}`);
    return true;
  } catch (err) {
    return false;
  }
}

export async function clearAllCache() {
  if (fs.existsSync(CACHE_DIR)) {
    try {
      const files = await fs.promises.readdir(CACHE_DIR);
      await Promise.all(files.map(file => fs.promises.unlink(path.join(CACHE_DIR, file))));
      console.log("🗑️ Cleared all cache files");
    } catch (err) {
      console.error("Error clearing all cache:", err);
    }
  }
}