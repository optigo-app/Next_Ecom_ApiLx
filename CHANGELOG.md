# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
