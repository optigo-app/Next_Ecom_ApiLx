# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [2026-03-19]

#### Modified

- `app/theme/fgstore.mapp/Menu/page.js`: **Integrated dual-cache system** — Implemented server-side validation (`GetCacheList`) and local storage caching (`/api/v1/cache`) for the menu. Restricted cache validation to `PackageId` only, as requested. Refactored fetch logic to handle cache hits, misses, and server-side cache booking (`BookCache`). Preserved all existing UI, formatting, and complex routing logic.
- `app/(core)/cache_utility/CacheBuilder.js`: **Added specialized menu cache helpers** — Introduced `buildMenuCacheKey` and `findMatchingMenuCacheEntry` to support caching logic that only depends on `PackageId`. This ensures menu caching is independent of more complex pricing parameters used by other components.
- `app/(core)/cache_utility/dynamic_serverCache.js`: **Performance Optimization** — Refactored cache utility to use asynchronous file I/O (`fs.promises`). This prevents blocking the event loop during concurrent home page requests, which was causing extreme latency (up to 26s). Also removed JSON pretty-printing to reduce file size and I/O overhead.
- `app/(core)/contexts/MasterProvider.js`: **Global Cache List Optimization** — Enabled `GetCacheList` fetching at the provider level. Standardized `finalID` calculation to use an empty string for null IDs. Exposed `cacheList` and `setCacheList` via `MasterContext` to all children.
- `app/theme/fgstore.mapp/home/components/Categories.jsx`, `GiftBlock.jsx`, `BestSellers.jsx`, `Trendings.jsx`, `Collection.jsx`, `NewArrivals.jsx`: **Consuming Global Cache List** — Refactored these components to use the shared `cacheList` from `MasterProvider` instead of making independent `GetCacheList` calls. This reduces redundant API requests on the home page from 6+ to just 1. Components now also sync updates to the global `cacheList` state after a successful `BookCache` operation.
- `app/theme/fgstore.mapp/home/components/NewArrivals.jsx`: **Integrated cache system** — Added the same cache pattern used in `Categories.jsx`, etc., to the New Arrivals block. Old behavior: fetched new arrivals directly from `Get_Tren_BestS_NewAr_DesigSet_Album` on every page load with no caching. New behavior: checks server cache (`GetCacheList`) and local cache (`/api/v1/cache`) in parallel; serves cached data when valid; falls back to API call and stores result in cache via `BookCache` + POST to `/api/v1/cache`. Event name: `home_newarrivals`. All existing product card mapping and navigation behaviors preserved.
- `app/theme/fgstore.mapp/home/components/Collection.jsx`: **Integrated cache system** — Added the same cache pattern used in `Categories.jsx`, etc., to the Most Loved Collections block. Old behavior: fetched collection items directly from `HomeCollectionApi` on every page load with no caching. New behavior: checks server cache (`GetCacheList`) and local cache (`/api/v1/cache`) in parallel; serves cached data when valid; falls back to API call and stores result in cache via `BookCache` + POST to `/api/v1/cache`. Event name: `home_collection`. All existing dummy image mapping and navigation behaviors preserved.
- `app/theme/fgstore.mapp/home/components/Trendings.jsx`: **Integrated cache system** — Added the same cache pattern used in `Categories.jsx`, `GiftBlock.jsx`, and `BestSellers.jsx` to the Trending block. Old behavior: fetched trending items directly from `Get_Tren_BestS_NewAr_DesigSet_Album` on every page load with no caching. New behavior: checks server cache (`GetCacheList`) and local cache (`/api/v1/cache`) in parallel; serves cached data when valid; falls back to API call and stores result in cache via `BookCache` + POST to `/api/v1/cache`. Event name: `home_trending`. All existing product card mapping and navigation behaviors (including scroll index) preserved.
- `app/theme/fgstore.mapp/home/components/BestSellers.jsx`: **Integrated cache system** — Added the same cache pattern used in `Categories.jsx` and `GiftBlock.jsx` to the BestSellers block. Old behavior: fetched best sellers directly from `Get_Tren_BestS_NewAr_DesigSet_Album` on every page load with no caching. New behavior: checks server cache (`GetCacheList`) and local cache (`/api/v1/cache`) in parallel; serves cached data when valid; falls back to API call and stores result in cache via `BookCache` + POST to `/api/v1/cache`. Event name: `home_bestseller`. All existing product card mapping and navigation behaviors preserved.
- `app/theme/fgstore.mapp/home/components/GiftBlock.jsx`: **Integrated cache system** — Added the same cache pattern used in `Categories.jsx` and `ref.js` to the Latest Albums block. Old behavior: fetched albums directly from `Get_Tren_BestS_NewAr_DesigSet_Album` on every page load with no caching. New behavior: checks server cache (`GetCacheList`) and local cache (`/api/v1/cache`) in parallel; serves cached data when valid; falls back to API call and stores result in cache via `BookCache` + POST to `/api/v1/cache`. Event name: `home_album`. All existing image validation and fallback behaviors preserved.
- `app/theme/fgstore.mapp/home/components/Categories.jsx`: **Integrated cache system** — Added the same cache pattern used in the Album component (`ref.js`) to the Categories block. Old behavior: fetched categories directly from `HomeCategoryApi` on every page load with no caching. New behavior: checks server cache (`GetCacheList`) and local cache (`/api/v1/cache`) in parallel; serves cached data when valid; falls back to API call and stores result in cache via `BookCache` + POST to `/api/v1/cache`. Event name: `home_category`. All existing fallbacks to `categoryImages` and image mapping preserved. Removed unused imports (`processAlbumImages`, `getSession`); added `Cookies`, `useCallback`, `useRef`.

### [2026-03-18]

#### Fixed

- `app/theme/fgstore.mapp/detail/_detComponents/page.jsx`: **Fixed Uncaught TypeError in ProductPage** — Added defensive checks before calling `Object.keys()` on `singleProd` and `defaultImg` to prevent "Cannot convert undefined or null to object" crashes when data is not yet available.
- `app/theme/fgstore.mapp/detail/_detComponents/Select.jsx`: **Fixed CustomSelect default value matching** — Updated the strict equality check in `CustomSelect` to do a loose equality fallback so that values like `"14K WHITE"` successfully match. Added a fallback to `options[0]` if no matching option is found to mirror native select behavior.
- `app/theme/fgstore.mapp/detail/_detComponents/MaterialCustomization.jsx`: **Fixed Optional Chaining in CustomSelect properties** — Updated `getOptionLabel` and `getOptionValue` references to `opt.metaltype`, `opt.Quality`, etc. to use `opt?.` optional chaining. This prevents `Cannot read properties of undefined` UI crashes when CustomSelect loads options asynchronously.
- `app/theme/fgstore.mapp/detail/_detComponents/page.jsx` + `InfoDetail.jsx`: **Fixed price not updating in UI after customization change** — `singleProd1` (updated from `SingleProdListAPI` on every customization change) was never passed as a prop to `InfoDetail`, so the price always showed the stale `singleProd` value. Added `singleProd1={singleProd1}` prop. Also fixed price formatting to apply `toLocaleString("en-IN")` to both `singleProd1` and `singleProd` consistently.
- `app/theme/fgstore.mapp/detail/_detComponents/page.jsx` + `page.scss`: **Added product image slider dots and fixed skeleton UI** — Enabled pagination dots in the image slider for better navigation. Fixed the "uneven" loading skeleton by matching skeleton dimensions to actual UI heights (150px thumbnails, 60vh main image) and removing incorrect offsets. Styled dots in SCSS for a premium look.
- `app/theme/fgstore.mapp/product/MobileBreadCrumb.jsx`: **Fixed missing breadcrumb title for categories** — Corrected the label mapping in `MobileBreadCrumb.jsx` to use `bObj.menuname` instead of `bObj.FilterVal1` for the first level of the breadcrumb. Old behavior: the title was blank when only one category filter was applied because `FilterVal1` was undefined. New behavior: the selected category name ("Pendant", etc.) is correctly displayed as the title.
- `app/theme/fgstore.mapp/detail/_detComponents/page.jsx`: **Fixed skeleton flickering and redundancy** — Consolidated loading states to use `loadingdata || PdImageLoader` for the main product skeleton. This ensures the skeleton stays visible until both product data and images are ready, preventing dual skeletons and layout flickering. Initialized `loadingdata` to `true` to ensure immediate skeleton display on load.
- `app/theme/fgstore.web/cart/B2bCart/Customization.js` + `smr_cartPage.scss`: **Refactored cart customization to 2x2 MUI Grid** — Replaced custom flex layout with MUI `Grid2` for a stable 2x2 arrangement of customization options (Metal, Diamond, etc.). Relocated the price display directly underneath the quantity selector as requested. Also fixed data-binding and label bugs in the Color Stone customization fields.

### [2026-03-16]

#### Added

- `app/theme/fgstore.mapp/ProfilePage/staticTabs/Appointment`: **Implemented Multi-step Appointment Form** — Created a new mobile-optimized appointment booking experience for the webview. Replicated business logic from the main site into a multi-step UI using MUI components (Selection -> Details -> Success). Fixed image pathing for static assets in the selection step.
- `app/theme/fgstore.mapp/ProfilePage/staticTabs/AboutUs`: **Implemented About Us Page** — Created a full-height static drawer with company information, mission, and vision, optimized for mobile screens.
- `app/theme/fgstore.mapp/ProfilePage/staticTabs/ContactUs`: **Implemented Contact Us Page** — Created a full-height right drawer with integrated Google Map, contact details, and a functional contact form using business logic from the web version.
- `app/theme/fgstore.mapp/ProfilePage/page.js`: Integrated the new appointment, newsletter, about us, and contact us tabs into the mobile profile page.

### [2026-03-14]

#### Fixed

- `app/(core)/contexts/AuthProvider.js`: **Fixed auth redirect race condition** — After login, navigating to any page (cart, profile, etc.) would redirect to home on the first attempt but work on the second. Root cause: `islogin` was in the first useEffect's dependency array, causing the effect to re-run when `StoreProvider` restored login state from sessionStorage, which prematurely set `isLoading = false` and let route protection redirect fire too early. Fix: added `useRef` guard (`hasInitializedAuth`) for one-time auth init, synchronous sessionStorage check to skip redundant API calls, and `prevTokenRef` to preserve mobile app (Flutter) token-from-URL re-authentication. Old behavior: first useEffect deps `[islogin, redirectEmailUrl, token, storeInit, isMobileApp]`. New behavior: deps `[token, storeInit, isMobileApp]`.
- `app/theme/fgstore.mapp/home/components/Categories.jsx`: Removed junk text and raw file paths that caused parsing errors. Cleaned up redundant entries in `categoryImages` array.
- `app/theme/fgstore.mapp/home/components/BottomNavigation.jsx`: Fixed syntax error in `Icon` component prop definition.

### [2026-03-13]

#### Modified

- `app/(core)/contexts/AuthProvider.js`: Fixed a race condition where `isLoading` was set to `false` prematurely before token-based authentication completed. Now `isLoading` correctly waits for authentication promises to resolve.
- `app/theme/fgstore.mapp/home/components/BottomNavigation.jsx`: Synced bottom navigation active state with the current `pathname` and ensured the navbar is visible on the profile page.
- `app/(core)/contexts/AuthProvider.js`: Defined `MOBILE_APP_REDIRECT_PATH` for centralized redirection. Consolidated `isMobileApp` detection to include `theme === "mobile app"` and domain `fgstore.mapp`. Restricted `WebLoginWithMobileToken` to mobile app domains and ensured login pages are inaccessible for mobile app users.

### [2026-03-12]

#### Modified

- `app/(core)/contexts/AuthProvider.js`: Enhanced post-login redirect fix to be case-insensitive and move logic to `useEffect`. Added domain-specific restriction for the `nxtmobileapp.web` domain to prevent access to login/register pages.
- `app/(core)/contexts/MasterProvider.js`: Restored and refined token-based login logic for the `nxtmobileapp.web` domain, ensuring correct redirection to the home page or intended destination in mobile webview mode.

### [2026-02-27]

#### Modified

- `app/theme/fgstore.mapp/home/components/GiftBlock.jsx`: Refactored for performance and UI consistency. Removed unused state, added Header component, and improved image handling.
