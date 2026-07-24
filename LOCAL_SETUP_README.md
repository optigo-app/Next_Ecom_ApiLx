# 🛠️ Local Development Setup — Important Configuration Files

This README explains the **critical files** you must update when switching brands, setting up a new machine, or running a production build locally.

---

## 1. 🌐 `app/(core)/utils/env.js`
**Purpose:** Sets the active brand/domain for the entire project.

```js
export const NEXT_APP_WEB = WEBSITE_DOMAINS.BELUXJEWELWEB; // ← Change this to switch brand
export const activeBrand = "beluxjewel";                   // ← Match this to the brand
```

### What to do:
- **When switching brands** → Change `NEXT_APP_WEB` to the correct domain key from `WEBSITE_DOMAINS`.
- **`NEXT_APP_WEB`** is used as the fallback hostname during `npm run build` when there is no live HTTP request (no browser, no headers).
- If this is set wrong, the build will try to fetch `StoreInit.json` from the CDN for the wrong domain → **HTTP 404 error**.

### Available Brands:
| Key | Domain |
|-----|--------|
| `FGSTORE` | `nxtsonasons.web` |
| `HOQ` | `nxthoq.web` |
| `FGSTOREMAPP` | `nxt09.optigoapps.com` |
| `ELVEEWEB` | `nxtelvee.web` |
| `DIAMONDINEWEB` | `nxtdiamondtine.web` |
| `BELUXJEWELWEB` | `beluxjewel.web` |

---

## 2. 🏠 `app/env.js`
**Purpose:** Sets the active theme/brand at the app root level.

```js
export const LocalSetup = "beluxjewel.web"; // ← Active theme folder
export const activeBrand = "beluxjewel";    // ← Active brand name
```

### What to do:
- **Always keep this in sync with `app/(core)/utils/env.js`.**
- `LocalSetup` controls which theme folder (`app/theme/<LocalSetup>/`) is loaded for each route.

---

## 3. 📋 `app/(core)/constants/DomainList.js`
**Purpose:** Registry of all **local development** hostnames.

```js
export const localHosts = [
  "localhost",
  "nxtsonasons.web",
  "nxthoq.web",
  "nxtelvee.web",
  "nxtmobileapp.web",
  "nzen",
  "nxt10.optigoapps.com",
  "nxt09.optigoapps.com",  // ← Added
  "beluxjewel.web",        // ← Added
];
```

### What to do:
- **When adding a new brand/domain for local dev** → Add it to the `localHosts` array.
- If a domain is **NOT** in this list, `isLocalHost()` returns `false` → the app tries to fetch `StoreInit.json` from the public CDN → **404 error during build**.
- Any domain in this list routes `StoreInit` fetching to your **local server** (`192.168.0.153`).

---

## 4. 🔄 `app/(core)/utils/fetchStoreInit.js`
**Purpose:** Fetches the `StoreInit.json` config — the backbone of every page.

### URL resolution logic:
```
Is it a local host? (from DomainList.js)
├── YES + NODE_ENV = development → http://192.168.0.153/R50B3/UFS/StoreInit/{NEXT_APP_WEB}/StoreInit.json
├── YES + NODE_ENV = production  → http://192.168.0.153/R50B3/UFS/StoreInit/{cleanHost}/StoreInit.json
│     └── if cleanHost = "localhost" → uses NEXT_APP_WEB as folder name
└── NO (public domain)           → https://cdnfs.optigoapps.com/content-global3/StoreInit/{hostname}/StoreInit.json
```

### ⚠️ Important during `npm run build`:
During build time there is **no active HTTP request**, so `headers()` is unavailable.
The hostname falls back to `NEXT_APP_WEB` from `env.js`. If `NEXT_APP_WEB` is not in `localHosts`, the CDN URL is used and fails with **HTTP 404**.

---

## 5. 🗺️ `app/(core)/utils/getDomainInfo.js`
**Purpose:** Resolves the current hostname from request headers (server-side) or `window.location` (client-side).

### Build-time fallback chain:
```
1. Try headers() → get "host" header
2. headers() throws (no request context during build) → catch
3. Return { hostname: NEXT_APP_WEB } ← from env.js
```

---

## 6. 🎨 `app/(core)/utils/ThemeRouteResolver.js`
**Purpose:** Maps the active theme to the correct page component using **static imports** (not dynamic wildcard imports).

### What to do:
- **When adding a new theme** → Add a new `case` entry to every resolver function (e.g., `getHomePage`, `getProductListPage`, etc.).
- Wildcard dynamic imports (`` import(`@/app/theme/${theme}/page`) ``) are **NOT used** — they cause Webpack to compile all themes at once, making the dev server very slow.

---

## ✅ Quick Checklist — Setting Up a New Brand Locally

| Step | File | What to Change |
|------|------|----------------|
| 1 | `app/env.js` | Set `LocalSetup` and `activeBrand` |
| 2 | `app/(core)/utils/env.js` | Set `NEXT_APP_WEB` to matching domain |
| 3 | `app/(core)/constants/DomainList.js` | Add the domain to `localHosts[]` |
| 4 | `app/(core)/utils/ThemeRouteResolver.js` | Add theme cases if it's a new theme |

---

> **Note:** After changing any of these files, restart the dev server (`npm run dev`) or rebuild (`npm run build`) for changes to take effect.
