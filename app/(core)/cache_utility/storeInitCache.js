import fs from "fs";
import path from "path";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";

const STORE_INIT_DIR = path.join(process.cwd(), "public", "storeInit");
const STORE_INIT_CACHE_TTL = Number(process.env.STORE_INIT_CACHE_TTL_MS) || 10000;
const memoryCache = new Map();
const pendingRequests = new Map();

const DEFAULT_DATA = {
  rd: [{}],
  rd1: [],
  rd2: [{}],
};

function getHostName(host) {
  return host ? host.split(":")[0].replace(/[:\/]/g, "_") : NEXT_APP_WEB;
}

function getFilePath(host) {
  return path.join(STORE_INIT_DIR, `${getHostName(host)}_storeInit.json`);
}

function getFileCreateDate(data) {
  return data?.rd?.[0]?.FileCreateDate ?? data?.FileCreateDate ?? null;
}

function readLocalFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.warn("[StoreInit Cache] Read Error:", err.message);
    return null;
  }
}

function writeLocalFile(filePath, data) {
  if (!fs.existsSync(STORE_INIT_DIR)) {
    fs.mkdirSync(STORE_INIT_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function loadStoreInitData(host, currentData) {
  const filePath = getFilePath(host);

  try {
    const remoteData = await fetchStoreInitData();

    if (!remoteData || Object.keys(remoteData).length === 0) {
      return currentData || DEFAULT_DATA;
    }

    const currentVersion = getFileCreateDate(currentData);
    const remoteVersion = getFileCreateDate(remoteData);
    const isSameVersion =
      currentVersion && remoteVersion && currentVersion === remoteVersion;
    const isSamePayload =
      currentData && JSON.stringify(currentData) === JSON.stringify(remoteData);

    if (isSameVersion || isSamePayload) {
      return currentData || remoteData;
    }

    writeLocalFile(filePath, remoteData);
    console.log("[StoreInit] Cache Updated");
    return remoteData;
  } catch (err) {
    console.error("[StoreInit]", err);
    return currentData || DEFAULT_DATA;
  }
}

function refreshStoreInitData(host, cacheKey, currentData) {
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const refreshPromise = loadStoreInitData(host, currentData)
    .then((data) => {
      memoryCache.set(cacheKey, { createdAt: Date.now(), data });
      return data;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, refreshPromise);
  return refreshPromise;
}

export async function getStoreInitData(host) {
  const cacheKey = getHostName(host);
  const cached = memoryCache.get(cacheKey);

  if (cached) {
    if (Date.now() - cached.createdAt >= STORE_INIT_CACHE_TTL) {
      refreshStoreInitData(host, cacheKey, cached.data).catch(() => {});
    }
    return cached.data;
  }

  const localData = readLocalFile(getFilePath(host));

  if (localData) {
    memoryCache.set(cacheKey, { createdAt: Date.now(), data: localData });
    refreshStoreInitData(host, cacheKey, localData).catch(() => {});
    return localData;
  }

  return refreshStoreInitData(host, cacheKey, DEFAULT_DATA);
}
