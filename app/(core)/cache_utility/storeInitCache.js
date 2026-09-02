/**
 * storeInitCache.js — Ultra-fast, robust storeInit layer
 * ────────────────────────────────────────────────────────
 * Read path (zero extra latency on every page load):
 *   1. Process-level memory map  → instant (µs)
 *   2. Disk JSON file            → fast (< 1 ms, survives restarts)
 *   3. Remote CDN fetch          → only on cold start or explicit revalidate
 *
 * Write path (always silent / non-blocking):
 *   • Background SWR revalidation fires after TTL expires.
 *   • Explicit revalidate() can be called from an API route.
 *   • Disk file is written atomically (tmp-rename) to prevent corrupt reads.
 *
 * Version / staleness logic:
 *   • FileCreateDate field in the JSON is used as a version token.
 *   • If the remote version equals the local version → skip disk write.
 *   • TTL for background revalidation: STORE_INIT_CACHE_TTL_MS env (default 60 s).
 *   • Disk file is always returned even if TTL has passed, but a revalidation
 *     is fired in the background so the next request gets fresh data.
 */

import fs from "fs";
import path from "path";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";

// ── Constants ────────────────────────────────────────────────────────────────
const STORE_INIT_DIR = path.join(process.cwd(), "public", "storeInit");
const TTL_MS = Number(process.env.STORE_INIT_CACHE_TTL_MS) || 60_000; // 60 s default

const DEFAULT_DATA = { rd: [{}], rd1: [], rd2: [{}] };

// ── In-process memory layer (per Node.js worker, cleared on restart) ─────────
const memoryCache = new Map(); // cacheKey → { data, cachedAt }
const pendingMap  = new Map(); // cacheKey → Promise  (dedup concurrent revalidations)

// ── Helpers ──────────────────────────────────────────────────────────────────
function sanitizeKey(host) {
  return host
    ? host.split(":")[0].replace(/[^a-zA-Z0-9._-]/g, "_")
    : process.env.NEXT_APP_WEB || "localhost";
}

function diskPath(cacheKey) {
  return path.join(STORE_INIT_DIR, `${cacheKey}_storeInit.json`);
}

function getVersion(data) {
  return data?.rd?.[0]?.FileCreateDate ?? data?.FileCreateDate ?? null;
}

// ── Atomic disk write (tmp → rename prevents partial reads) ──────────────────
async function writeDisk(filePath, data) {
  const tmpPath = filePath + ".tmp";
  try {
    await fs.promises.mkdir(STORE_INIT_DIR, { recursive: true });
    await fs.promises.writeFile(tmpPath, JSON.stringify(data), "utf8");
    await fs.promises.rename(tmpPath, filePath);
  } catch (err) {
    console.error("[StoreInit] Disk write failed:", err.message);
    // Clean up orphaned tmp if rename failed
    fs.promises.unlink(tmpPath).catch(() => {});
  }
}

// ── Synchronous disk read (used in hot path — avoids async overhead) ─────────
function readDiskSync(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.warn("[StoreInit] Disk read failed:", err.message);
    return null;
  }
}

// ── Disk file mtime-based staleness check ────────────────────────────────────
function isDiskStale(filePath) {
  try {
    const { mtimeMs } = fs.statSync(filePath);
    return Date.now() - mtimeMs >= TTL_MS;
  } catch {
    return true; // file doesn't exist → stale
  }
}

// ── Core background revalidation ─────────────────────────────────────────────
async function _doRevalidate(cacheKey, existingData) {
  const filePath = diskPath(cacheKey);
  try {
    const remote = await fetchStoreInitData();

    if (!remote || Object.keys(remote).length === 0) {
      // Remote returned nothing — keep existing, update memory TTL
      if (existingData) {
        memoryCache.set(cacheKey, { data: existingData, cachedAt: Date.now() });
      }
      return existingData ?? DEFAULT_DATA;
    }

    // Version check — skip write if data hasn't changed
    const localVersion  = getVersion(existingData);
    const remoteVersion = getVersion(remote);
    const sameVersion   = localVersion && remoteVersion && localVersion === remoteVersion;
    const samePayload   = existingData && JSON.stringify(existingData) === JSON.stringify(remote);

    if (sameVersion || samePayload) {
      // Refresh TTL in memory without touching disk
      memoryCache.set(cacheKey, { data: existingData ?? remote, cachedAt: Date.now() });
      return existingData ?? remote;
    }

    // New version → write to disk atomically, update memory
    await writeDisk(filePath, remote);
    memoryCache.set(cacheKey, { data: remote, cachedAt: Date.now() });
    console.log(`[StoreInit] Silent update → ${cacheKey} (v${remoteVersion})`);
    return remote;
  } catch (err) {
    console.error("[StoreInit] Revalidation error:", err.message);
    // Preserve whatever we had
    if (existingData) {
      memoryCache.set(cacheKey, { data: existingData, cachedAt: Date.now() });
    }
    return existingData ?? DEFAULT_DATA;
  }
}

// ── Deduplicated revalidation trigger ────────────────────────────────────────
function triggerRevalidate(cacheKey, existingData, { awaitResult = false } = {}) {
  if (pendingMap.has(cacheKey)) {
    return awaitResult ? pendingMap.get(cacheKey) : null;
  }

  const p = _doRevalidate(cacheKey, existingData).finally(() => {
    pendingMap.delete(cacheKey);
  });

  pendingMap.set(cacheKey, p);

  if (awaitResult) return p;

  // Fire-and-forget — never let it bubble up to the caller
  p.catch(() => {});
  return null;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * getStoreInitData(host)
 * ─────────────────────
 * Always returns instantly from memory or disk.
 * Triggers a background revalidation when TTL has passed.
 * Awaits a remote fetch ONLY on the very first cold-start (no disk file).
 */
export async function getStoreInitData(host) {
  const cacheKey = sanitizeKey(host);
  const filePath = diskPath(cacheKey);

  // ── 1. Memory hit ───────────────────────────────────────────────────────
  const mem = memoryCache.get(cacheKey);
  if (mem) {
    const stale = Date.now() - mem.cachedAt >= TTL_MS;
    if (stale) {
      // Return stale data immediately, revalidate silently in background
      triggerRevalidate(cacheKey, mem.data);
    }
    return mem.data;
  }

  // ── 2. Disk hit ─────────────────────────────────────────────────────────
  const disk = readDiskSync(filePath);
  if (disk) {
    // Populate memory from disk immediately (fast path for next request)
    memoryCache.set(cacheKey, { data: disk, cachedAt: Date.now() });

    if (isDiskStale(filePath)) {
      // Disk file is older than TTL — revalidate silently
      triggerRevalidate(cacheKey, disk);
    }
    return disk;
  }

  // ── 3. Cold start — await the first fetch (only happens once) ───────────
  console.log(`[StoreInit] Cold start for ${cacheKey} — fetching…`);
  const fresh = await triggerRevalidate(cacheKey, null, { awaitResult: true });
  return fresh ?? DEFAULT_DATA;
}

/**
 * revalidateStoreInit(host)
 * ─────────────────────────
 * Explicitly trigger a fresh remote fetch and update both disk & memory.
 * Intended for: admin panels, CDN webhook handlers, /api/store-init/revalidate.
 * Returns the fresh data (or current cached data if fetch fails).
 */
export async function revalidateStoreInit(host) {
  const cacheKey = sanitizeKey(host);
  const existing = memoryCache.get(cacheKey)?.data ?? readDiskSync(diskPath(cacheKey));
  return triggerRevalidate(cacheKey, existing, { awaitResult: true });
}

/**
 * getStoreInitMemory(host)
 * ────────────────────────
 * Cheap synchronous read — returns whatever is currently in the memory cache.
 * Returns null if memory cache is empty (disk/network never needed here).
 */
export function getStoreInitMemory(host) {
  return memoryCache.get(sanitizeKey(host))?.data ?? null;
}

/**
 * clearStoreInitCache()
 * ─────────────────────
 * Clears in-process memory cache and deletes all disk cache files in public/storeInit
 */
export async function clearStoreInitCache() {
  memoryCache.clear();
  pendingMap.clear();
  if (fs.existsSync(STORE_INIT_DIR)) {
    try {
      const files = await fs.promises.readdir(STORE_INIT_DIR);
      for (const file of files) {
        if (file.endsWith(".json") || file.endsWith(".tmp")) {
          await fs.promises.unlink(path.join(STORE_INIT_DIR, file)).catch(() => {});
        }
      }
      console.log("[StoreInit] Cleared all storeInit disk and memory cache");
    } catch (err) {
      console.error("[StoreInit] Error clearing storeInit cache:", err);
    }
  }
}
