import fs from "fs";
import path from "path";

// const CACHE_DIR = path.resolve("F:/next-ecomm(apilx)/app/next_cache");
const CACHE_DIR = path.join(process.cwd(), ".next_cache");

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const defaultTTL = 12 * 60 * 60 * 1000; // 12h
const safeKey = (key) => key.replace(/[^a-zA-Z0-9_\-]/g, "_");


export async function setCache(key, data, meta) {
  const now = Date.now();
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);
  const payload = {
    timestamp: now,
    meta,
    data,
  };

  fs.promises
    .writeFile(file, JSON.stringify(payload, null, 2), "utf8")
    .then(() => console.log(`✅ [CACHE SAVED] ${key}`))
    .catch((err) => console.error(`❌ Cache write failed for ${key}:`, err));
}

export async function getCache(key, ttlMs = defaultTTL) {
  const now = Date.now();
  const file = path.join(CACHE_DIR, `${safeKey(key)}.json`);

  if (fs.existsSync(file)) {
    try {
      const cached = JSON.parse(fs.readFileSync(file, "utf8"));
      if (now - cached.timestamp < ttlMs) {
        // console.log(`💾 [CACHE HIT - DISK] ${key}`);
        return cached.data;
      }
      console.log(`⏰ [CACHE EXPIRED] ${key}`);
    } catch (err) {
      console.warn(`⚠️ Corrupt cache file for ${key}, removing`);
      fs.unlinkSync(file);
    }
  }

  console.log(`🚫 [CACHE MISS] ${key}`);
  return null;
}


// --- NEW FUNCTIONS FOR DASHBOARD ---

export async function getAllCachedItems() {
  if (!fs.existsSync(CACHE_DIR)) return [];

  const files = fs.readdirSync(CACHE_DIR);
  const items = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    
    const filePath = path.join(CACHE_DIR, file);
    try {
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, "utf8");
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
}

export async function clearCache(key) {
  // We accept either the original key or the filename
  let filename = key.endsWith(".json") ? key : `${safeKey(key)}.json`;
  const file = path.join(CACHE_DIR, filename);
  
  if (fs.existsSync(file)) {
    await fs.promises.unlink(file);
    console.log(`🗑️ [CACHE CLEARED] ${key}`);
    return true;
  }
  return false;
}

export async function clearAllCache() {
  if (fs.existsSync(CACHE_DIR)) {
    try {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      console.log("🗑️ Cleared and recreated .next_cache directory");
    } catch (err) {
      console.error("Error clearing cache directory:", err);
    }
  }
}