"use server";
/**
 * Server Actions for cache read/write.
 * Replaces client-side fetch('/api/v1/cache') with direct filesystem access.
 * No HTTP round-trip — runs on the server, returns plain data to the client.
 */
import { getCache, setCache } from "@/app/(core)/cache_utility/dynamic_serverCache";

/**
 * Read from disk cache by key.
 * @param {string} key - Cache key
 * @returns {{ cached: boolean, data: any }}
 */
export async function readCache(key) {
  try {
    const data = await getCache(key);
    if (data) return { cached: true, data };
    return { cached: false, data: null };
  } catch {
    return { cached: false, data: null };
  }
}

/**
 * Write to disk cache (fire-and-forget safe to call from client).
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export async function writeCache(key, data) {
  try {
    await setCache(key, data);
  } catch (err) {
    console.error("[cacheActions] writeCache failed:", err);
  }
}
