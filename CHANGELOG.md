## [2026-04-03]

- **EliorApp About Us Content Update**:
  - **Files modified**: `app/(core)/constants/AppConfig.js`
  - **Old behavior**: The `EliorApp.about_us` section contained placeholder content copied from the Sonasons brand (Our Milieu, Brand Statement, Vision, Mission — all referencing Sonasons/Khodal Gems/Mr. Dhaval Kaladiya).
  - **New behavior**: Replaced with authentic Elior Jewel brand content across four sections: "Experience the brilliance with us" (brand intro), "Elior Advantage" (direct-to-consumer value proposition), "Brand Vision" (Mr. Hemal Dholakia's mission), and "Our Promise" (quality guarantees and policies).
  - **Reason for change**: EliorApp was displaying incorrect brand information belonging to Sonasons.


- **New constants for Theme Assets**:
  - **Files created**: `app/(core)/constants/MobileAppConfig.js`.
  - **Changes made**: Centralized Favicon and Logo paths for `Sonasons`, `omjiyas`, and `hoq` themes.
  - **Reason for change**: Consolidate hardcoded theme asset paths from `layout.js` and `ServerHelper.js` into a reusable constant.

## [2026-04-02]

- **Mobile UI Stability & iOS Zoom Prevention**:
  - **Files modified**: `app/layout.js`, `app/components/(dynamic)/Account/changePassword/ChangePassword.js`, `app/components/(dynamic)/Account/YourProfile/YourProfile.js`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/Appointment/InquiryModal.jsx`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/Bespoke/InquiryModal.jsx`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/ContactUs/ContactUs.jsx`.
  - **Old behavior**: Interactive inputs often had small font sizes (<16px), causing iOS Safari to aggressively zoom in on focus, breaking the layout. Some mobile drawers were cut off or unscrollable due to static height calculations.
  - **New behavior**: Standardized `16px` font-size for all inputs and implemented `100dvh` for drawers. The viewport meta-tag was hardened to prevent unwanted scaling. This ensures a stable, premium mobile experience.
  
- **Strict Form Validation & Numeric Inputs**:
  - **Files modified**: `app/theme/fgstore.mapp/ProfilePage/staticTabs/Bespoke/BespokeInquiry.jsx`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/ContactUs/ContactUs.jsx`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/Appointment/InquiryModal.jsx`.
  - **Old behavior**: Phone fields allowed alphabetic characters and didn't automatically trigger the number pad on mobile.
  - **New behavior**: Added real-time numeric filtering and `inputMode="numeric"`. Users can now only type digits in phone fields, and the mobile keyboard defaults to the number pad.

- **Product Detail Data & Price Synchronization**:
  - **Files modified**: `app/theme/fgstore.mapp/detail/_detComponents/PriceBreakUp.jsx`, `app/theme/fgstore.mapp/detail/_detComponents/InfoDetail.jsx`, `app/theme/fgstore.mapp/detail/_detComponents/StaticMaterial.jsx`.
  - **Old behavior**: After changing metal purity or other customization options, the technical specs (Net Wt) and the Price Breakup stayed stuck on the initial values because the code prioritized the original product state over the updated selection.
  - **New behavior**: Unified the "Current Product" state mapping. The entire UI now instantly switches to `singleProd1` (updated data) as soon as a customization is made, ensuring accurate pricing and weights.

- **Bespoke Jewellery Enhancements**:
  - **Files modified**: `app/theme/fgstore.mapp/ProfilePage/page.js`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/Bespoke/Bespoke.jsx`, `app/theme/fgstore.mapp/ProfilePage/staticTabs/Bespoke/InquiryModal.jsx`.
  - **Improvements**: Corrected "Bespoke Jewelry" spelling to "Bespoke Jewellery" site-wide. Added visual feedback for file attachments; the button now displays the selected filename so the user knows the attachment was successful.

- **Appointment Date Logic**:
  - **Files modified**: `app/theme/fgstore.mapp/ProfilePage/staticTabs/Appointment/AppointmentInquiry.jsx`.
  - **Fix**: Updated `minDateTime` to use local time instead of UTC, preventing users from being blocked from selecting the current day's appointments.

## [2026-04-02 - Previous]

- **Profile Page URL-Based Drawer Sync**: Refactored drawer/modal state management on the Profile page from `useState` to URL query params (`?drawer=<key>`) so the mobile back button correctly closes drawers instead of navigating away.
  - **Files modified**: `app/theme/fgstore.mapp/ProfilePage/page.js`
  - **Old behavior**: All drawers (About Us, Contact Us, Bespoke, Appointment, Newsletter, static pages, Logout) were toggled via independent `useState` booleans. Each drawer open pushed no history entry, so pressing back would leave the profile page entirely — going to cart or the previous page.
  - **New behavior**: Opening any drawer calls `router.push('/profile?drawer=<key>')`, adding a real history entry. The drawer's open/close state is derived from reading `searchParams.get("drawer")`. Closing a drawer calls `router.back()`, which pops the entry and restores the profile page. This makes the back button behave natively and correctly for all drawers.
  - **Reason for change**: User reported that navigating through multiple drawers and pressing back would skip the profile page entirely, jumping to cart or the previous page.

- **Mobile Keyboard iPhone UI Fix (BottomNavigation)**: Solved a visual glitch on iOS Safari/Webviews where the fixed bottom navigation bar overlaps with the content and gets squished above the software keyboard when focusing on an input (like the search bar).
  - **Files modified**: `app/theme/fgstore.mapp/home/components/BottomNavigation.jsx`
  - **Old behavior**: The `BottomNavigation` remained `position: "fixed"` at `bottom: 0` during text entry. When the virtual keyboard materialized, iOS Webviews dynamically pushed the whole toolbar up, causing it to awkwardly intersect inputs and page content.
  - **New behavior**: Implemented an advanced `window.visualViewport` listener. This calculates the physical available height of the screen and hides the BottomNavigation block dynamically when the screen explicitly shrinks by >150px (which strictly designates keyboard presence). This bulletproofs against situations where the keyboard is hidden but the input keeps logic focus.
  - **Reason for change**: User noted that traditional DOM focus listeners fail when tapping away/scrolling dismisses the iPhone keyboard without removing logical focus from the input.

- **Account Ledger Excel Download Fix**: Fixed an issue where the Excel download button didn't work inside the mobile app (Flutter Webview).
  - **Files modified**: `app/(core)/utils/Glob_Functions/GlobalFunction.js`
  - **Old behavior**: The `downloadExcelLedgerData` function clicked a hidden `a` tag generated by `react-html-table-to-excel` using a `data:` URI which mobile webviews typically block or ignore.
  - **New behavior**: Replaced the implementation with a robust download strategy. It creates a `Blob`, tests if `navigator.share` is available for mobile sharing (allowing users to save to files/Google Drive seamlessly), and falls back to a standard `URL.createObjectURL` approach by dynamically adding and clicking the link in the DOM.
  - **Reason for change**: User reported that clicking "Download" on the Account Ledger page did not download the Excel file when inside the mobile app.

- **Detail Page Image Loading Fix (fgstore.mapp)**: Fixed "NO IMAGE" flash before real images load on the product detail page.
  - **Files modified**: `app/theme/fgstore.mapp/detail/_detComponents/page.jsx`
  - **Old behavior**: `imageLoaded` was set to `false` on mount (in the URL-decode useEffect), which dismissed the skeleton loader before `ProdCardImageFunc` could validate images. This caused users to see "NO IMAGE" placeholder briefly, then the real image appeared — bad UX especially for designs like ANB6, ANB4.
  - **New behavior**: Skeleton loader stays visible until `ProdCardImageFunc` completes its async image validation. The skeleton is also re-shown when navigating between designs (`handleMoveToDetail`). Flow: skeleton → validated image (or fallback if no valid image exists). No more "NO IMAGE" flash.
  - **Changes made**:
    1. Removed premature `setIsImageLoaded(false)` from mount useEffect
    2. Added `setIsImageLoaded(true)` at start of `ProdCardImageFunc` to show skeleton during validation
    3. Added `setIsImageLoaded(false)` at end of `ProdCardImageFunc` after images are validated
    4. Added `setIsImageLoaded(true)` in `handleMoveToDetail` to show skeleton when switching designs
  - **Reason for change**: User reported poor UX where "NO IMAGE" placeholder flashed before actual images loaded on detail pages.

- **Mobile Address Modal Scroll Fix**: Fixed modal overflowing viewport causing inputs to be unreachable and validation errors to push fields out of view.
  - **Files modified**: `app/components/(dynamic)/Account/address/ManageAddress.js`
  - **Old behavior**: The modal had no `maxHeight` or `overflowY` set, so on smaller screens (or when validation errors increased height/keyboard opened), it extended beyond the viewport boundaries and was unscrollable, trapping the user.
  - **New behavior**: Set `maxHeight: '85vh'` and `overflowY: 'auto'` on the `<Box>` component inside the `<Modal>`, ensuring it always fits within the screen and is scrollable regardless of dynamic error text or keyboard behavior.
  - **Reason for change**: User reported that when adding/editing an address on mobile and clicking the first name field (or triggering layout-shifting errors), the fields went "too far up" and everything became unreachable since the user couldn't scroll.

## [2026-03-31]

- **Cart & Wishlist Loading Optimization**: Resolved "flash of empty state" issue where "No Items Found" would appear briefly before products loaded.
  - **Files modified**:
    - `app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart.js`: Initialized `isloding` to `true` and populated `finalCartData` immediately on API response.
    - `app/(core)/utils/Glob_Functions/Cart_Wishlist/Wishlist.js`: Populated `finalWishData` immediately on API response to eliminate the processing gap.
    - `app/theme/fgstore.mapp/cart/B2bCart/Cart.js`: Hardened empty state check to ensure `isloding` is false and list is truly empty.
    - `app/theme/fgstore.mapp/Wishlist/WishlistData.js`: Hardened empty state check with `!isloding` guard.
  - **Reason for change**: Improve perceived performance and eliminate jarring UI flickering on initial load.

- **Product Listing Layout Fix**: Resolved "extra padding on right side" issue by correcting Grid props and ensuring full-width containers.
  - **Files modified**: 
    - `app/theme/fgstore.mapp/product/ProductView.jsx`: Changed `size` to `xs` and added `sx={{ width: "100%", margin: 0 }}` to the container.
    - `app/theme/fgstore.mapp/product/ProductListSkeleton.jsx`: Changed `size` to `xs` and added `sx={{ width: "100%", m: 0 }}` to the container.
    - `app/theme/fgstore.mapp/product/ProductCard.jsx`: Changed internal Grid items from `size={6}` to `item xs={6}` and ensured container has `width: "100%"`.
  - **Reason for change**: The use of the `size` prop on the old MUI Grid component (instead of `xs`) caused items to shrink to content width instead of filling their 50% (xs:6) slot, leading to large gaps/padding on the right.

- **Mobile Breadcrumb Performance & Reliability**: Improved breadcrumb menu responsiveness and added safety guards.
  - **Files modified**: 
    - `app/theme/fgstore.mapp/product/MobileBreadCrumb.jsx`: Added `menuDecode` guards, optimized `BreadCumsObj` calculation, and ensured menu closes before navigation.
    - `app/theme/fgstore.mapp/product/MobileHeader.jsx`: Fixed invalid HTML (Stack inside Typography) which could cause layout/event issues.
  - **Reason for change**: User reported "sluggish" menu behavior. Closing the menu before triggering route changes improves perceived latency.

- **Custom Order Link Integration**: Added a "CUSTOM ORDER" link to all header variations.
  - **Files modified**: `app/components/(dynamic)/Header/Header.jsx`.
  - **New behavior**: A "CUSTOM ORDER" link is now visible immediately after the Lookbook link.
- **Custom Order Page UI Enhancement**: Migrated the page to use the web-optimized theme and refined the UI.
  - **Files modified**: `app/custom-orders/page.js`, `app/theme/fgstore.web/CustomOrder/index.js`.
  - **Old behavior**: Used the mobile app theme (`fgstore.mapp`) which was too narrow and lacked proper responsive structure for web.
  - **New behavior**: Switched to `fgstore.web` theme. Refactored the UI using a centered MUI `Container` with `maxWidth="md"`, improved contrast and spacing. Replaced hardcoded brand mentions with dynamic store data (Om Jiyansh).
  - **Reason for change**: User request to make it look like a "proper website" page.

## [2026-03-30]

- **Header Logo Size and Responsiveness Fix**: Optimized the logo alignment and size in the header across all devices.
  - **Files modified**: `app/components/(dynamic)/Header/Header.modul.scss`.
  - **New behavior**: Re-adjusted container widths for `smiling_Top_header_div1`, `smiling_Top_header_div2_web`, `smiling_Top_header_div2_Mobile`, and `smiling_Top_header_div3` to give more space (20%-flex) to the logo. Added specific styles for the mobile logo container and balanced `max-height` constraints. 
  - **Reason for change**: User reported the logo was too small on various devices.

- **Footer Logo Size Fix**: Balanced the footer logo size to match the overall design.
  - **Files modified**: `app/components/(static)/Footer/FooterNew.scss`.
  - **New behavior**: Implemented `max-height: 140px` (Desktop) and `max-height: 100px` (Mobile) for the footer logo to prevent it from overwhelming other footer elements.
  - **Reason for change**: User requested to fix the footer logo to look "proper."

- **Updated Logo Assets**: Updated logo paths for the OmJiyansh brand.
  - **Files modified**: `app/(core)/lib/ServerHelper.js`.
  - **New behavior**: Pointed to the new "final logo" image for both web and mobile.
  - **Reason for change**: Branding update with new assets.

## [2026-03-25]

- **Terms and Conditions Data Update**: Integrated OmJiyansh Jewels content and added a theme switcher.
  - **Files modified**: `app/theme/fgstore.web/TermsAndConditions/page.js`.
  - **New behavior**: The page now dynamically renders content for either Sonasons or Omjiyansh based on the active theme setting.
  - **Reason for change**: Request to add OmJiyansh content with a structured data approach.

- **Header Shadow Visibility Fix**: Resolved the issue where the header's box-shadow was not visible.
  - **Files modified**: `app/components/(dynamic)/Header/Header.modul.scss`.
  - **New behavior**: Added `position: relative`, `z-index: 100`, and a stronger `box-shadow` to the header wrapper. Fixed a border typo (`1xp`).
  - **Reason for change**: User feedback that the shadow was not visible.

- **Logo Size and Scaling Fix**: Optimized the logo alignment and size in the header.
  - **Files modified**: `app/components/(dynamic)/Header/Header.modul.scss`.
  - **New behavior**: Increased the logo container width from 30% to 50% and replaced restrictive `max-width` with `max-height: 90px` to allow the logo to fill more space while maintaining aspect ratio.
  - **Reason for change**: User reported the logo was too small.

- **Dynamic Port Management**: Implemented a system to manage the application port via a configuration file.
  - **Files modified**: `package.json`, `ports.json` [NEW], `scripts/sync-port.js` [NEW].
  - **New behavior**: The port number is read from `ports.json` and automatically updated in `package.json` scripts (`dev`, `start`, `dev:watch`) via `predev` and `prestart` hooks.
  - **Reason for change**: Request for dynamic port passing from a file.

- **Favicon Fix**: Resolved the issue where the favicon was not displaying.
  - **Files modified**: `app/layout.js`.
  - **New behavior**: Moved favicon to `public/` and updated metadata to use a relative URL `/om-jiyansh-favicon.ico`.
  - **Reason for change**: Favicon was in the wrong directory and had spaces in the filename.

- **About Us Content Update**: Updated the About Us page for OmJiyansh Jewels.
  - **Files modified**: `public/WebSiteStaticImage/html/OmAbout.html`.
  - **New behavior**: Replaced old content with new information about Ajay Shah and Kalpesh Mangukiya. Added modern, responsive styling.
  - **Reason for change**: User request to update company information and branding.

## [2026-03-24]
- **MasterProvider Performance Optimization**: Improved initial load speed and data availability.
  - **Files modified**: `app/(core)/contexts/MasterProvider.js`.
  - **Old behavior**: Artificial 2-second delay for `payMaster` fetch; broken asynchrony in combo API calls (not waited for); redundant API calls even if data was in session.
  - **New behavior**: Parallelized and properly awaited combo API calls; reduced `payMaster` delay to 100ms; implemented session caching to skip redundant fetches; added `isMasterReady` state for better synchronization.
  - **Reason for change**: Resolve user report of "mastre is loading too slwo and very late".

- **MasterProvider Initialization Simplification**: Removed redundant client-side `storeInit` recovery logic (refetching) as it is already provided via middleware.
  - **Files modified**: `app/(core)/contexts/MasterProvider.js`.
  - **Improvement**: Streamlined the `useEffect` hook to focus on session persistence and visitor ID initialization, reducing unnecessary client-side execution and potential race conditions.

### Modified

- **Product Description Handling (fgstore.web)**: Fixed an issue where the product description "Show More" button was missing or not functioning correctly on certain screen sizes.
  - **Files modified**:
    - `app/theme/fgstore.web/detail/page.scss`: Fixed invalid CSS `height: none` to `height: auto` and added standard `line-clamp` properties for better browser compatibility.
    - `app/theme/fgstore.web/detail/_detComponents/components/ProductInfo.jsx`: Implemented a simplified character-length based toggle (~160 chars) and enabled `dangerouslySetInnerHTML` for description rendering. Removed complex ref-based overflow detection.
    - `app/theme/fgstore.web/detail/_detComponents/hooks/useProductCustomization.js`: Removed `checkTextOverflow` and `isClamped` state in favor of the simplified length-based approach.
  - **Old behavior**: Description was rendered as plain text, "Show More" logic relied on fragile `scrollHeight` vs `clientHeight` comparisons which failed on high-resolution screens.
  - **New behavior**: Robust description toggle based on content length, full HTML support, and simplified logic for better stability across all devices.
  - **Reason for change**: Fix reported UI bug where "Show More" was missing on large screens and align with "Simple" implementation request for production reliability.

- **Session Data & API Reliability**: Resolved `SyntaxError` and potential `TypeError` in multiple API utils caused by redundant `JSON.parse` calls on already-parsed session objects.
  - **Files modified**: `GetCategorySizeAPI.js`, `CartAndWishListAPI.js`, `RemoveCartAndWishAPI.js`, `SaveLastViewDesign.js`, `DesignSetListAPI.js`, `StockItemApi.js`, `SingleProdListAPI.js`.
  - **Old behavior**: `JSON.parse` was incorrectly called on objects returned by the new `getSession` helper, causing runtime crashes. Missing optional chaining on `loginUserDetail.id` could lead to further crashes.
  - **New behavior**: Simplified session data retrieval using the `getSession` helper directly and implemented robust optional chaining.
  - **Reason for change**: Fix critical runtime errors after refactoring to a safer session management system.

- **Product Detail Initialization**: Resolved a race condition where customization dropdowns (Metal Type, Color, etc.) would not appear on initial load.
  - **Files modified**: `app/theme/fgstore.web/detail/_detComponents/hooks/useProductDetail.js`.
  - **Old behavior**: Initial selections were set once on mount, often before combo data was fetched, leading to hidden UI elements.
  - **New behavior**: Selection state is now reactive to combo data updates, ensuring UI populates as soon as data is ready.

- **Product Listing Initialization**: Resolved a race condition where the listing page showed "Products Not found" or incomplete filters on the first load.
  - **Files modified**: `app/theme/fgstore.web/product/_prodComponents/page.jsx`.
  - **Old behavior**: Fragmented initialization in multiple `useEffect` hooks caused the initial fetch to run with stale or missing filter IDs.
  - **New behavior**: Synchronous state initialization from session data and props ensures correct parameters for the first render and API call.
### 6. Product Card Metal Display Robustness
Resolved a UI issue in `Product_Card.jsx` where the metal color and type display would show a leading hyphen if the metal color was missing.
- Implemented conditional rendering for the hyphen to ensure it only appears when both values are present.
- Improved metadata display fallback for a cleaner product card UI.





## [2026-03-23]
### 7. Home Page Data Robustness
Strengthened the data fetching and caching logic for dynamic home page sections to handle missing or incomplete store metadata gracefully.
- Modified `getPricingContext` to return `null` if a `PackageId` cannot be resolved.
- Added explicit guards in `AlbumSection`, `BestSellerSection1`, `NewArrival1`, `TrendingView1`, and `DesignSet2` to wait for a valid pricing context.
- Ensured that sections display skeletons instead of "Empty" messages or invalid data during the initial metadata recovery phase.
### Modified

- **Session & Global Management**: Implemented robust session storage and global `window` access for critical store and user data. Added an **Auto-Refetch Fallback** and **Async Robust Getters**.
  - **Files modified**:
    - `app/(core)/utils/FetchSessionData.js`: Added `getSessionAsync` for async waiting and automatic sync to `window` globals.
    - `app/(core)/contexts/MasterProvider.js`: Implemented client-side re-fetch logic for `storeInit` using `fetchStoreInitData`.

### 8. API Parameter Normalization
Resolved an issue where `undefined` variables were being incorrectly transmitted as the string `"undefined"` in API request bodies.
- Refactored `FilterListAPI.js` and `ProductListApi.js` to remove problematic template literals.
- Implemented consistent defaulting to empty strings for missing metadata.
- Verified that `PackageId` and `FrontEnd_RegNo` are correctly transmitted even when session state is partially initialized.

    - `app/(core)/utils/API/Combo/*.js`: Refactored all combo APIs to use `getSessionAsync` to wait for configuration data.

### 9. MasterProvider Performance Optimization
Significantly improved the application's perceived performance by optimizing the initial configuration load.
- Replaced 7 individual API calls with a single aggregated `/api/v1/combos` request.
- Implemented server-side parallel fetching and 30-minute caching.
- Added a client-side session-persistence layer to eliminate redundant fetches on page refreshes.
- Result: Drastically faster "skeleton-to-data" transition for all dynamic sections.### 10. MasterProvider Simplification
Streamlined the initialization process by removing redundant client-side recovery logic.
- Relies on middleware-provided `getStoreInit` instead of manual refetching.
- Simplified `useEffect` hook for better maintenance and slightly faster startup.

  - **Old behavior**: Inconsistent access to session data; potential crashes if `sessionStorage` was accessed too early or if `storeInit` was null, leading to "FrontEnd Registration Error".
  - **New behavior**: Centralized, robust access via `getSession/setSession` with automatic `window` global sync (`__STORE_INIT__`, `__LOGIN_USER__`, `__LOGIN_USER_DETAIL__`) and async retry logic via `getSessionAsync`.
  - **Reason for change**: Fix reported "FrontEnd Registration Error" and provide reliable, easy-to-access global data for both client components and utility functions.

- **TypeError Fix (GlobalFunction.js)**: Added defensive null checks to utility functions that access `sessionStorage`.
  - **Files modified**: `app/(core)/utils/Glob_Functions/GlobalFunction.js`
  - **Old behavior**: `findMetalColor`, `findMetalType`, etc., would crash if the required data was not yet available in `sessionStorage` (calling `.filter()` on `null`).
  - **New behavior**: These functions now use the `getSession` helper and provide a default empty array `[]` if data is missing, preventing crashes.
  - **Reason for change**: Resolve reported "Cannot read properties of null (reading 'filter')" error during initial page load.
  - **Date**: 2026-03-23

## [2026-03-21]

### Modified

- **Authentication Flow (Session Data Cleanup)**: Implemented automatic clearing of stale `registerEmail` and `registerMobile` from `sessionStorage` to prevent old data from being displayed when a new user attempts to log in.
  - **Files modified**: 
    - `app/theme/fgstore.web/Auth/ContinueWithEmail/page.js`
    - `app/theme/fgstore.web/Auth/ContinueWithMobile/page.js`
    - `app/theme/hoq.web/Auth/ContinueWithEmail/page.js`
    - `app/theme/fgstore.mapp/Auth/ContinueWithEmail/page.js`
  - **Old behavior**: `registerEmail` and `registerMobile` persisted in `sessionStorage` across login attempts, showing the previous user's email/mobile when starting a new flow.
  - **New behavior**: These session tokens are now cleared on mount in the "Continue With" (entry) pages to ensure every new login attempt starts fresh.
  - **Reason for change**: Fix reported issue where new users saw old registered emails while preserving "carry forward" and page refresh reliability for the current user.

- **Header (Search Overlay Fix)**: Replaced `ClickAwayListener` with manual click-outside detection using `useRef` and a global event listener.
  - **Files modified**: `app/components/(dynamic)/Header/Header.jsx`
  - **Old behavior**: Conflicting `ClickAwayListener` instances caused the search overlay to close unexpectedly when clicking the input field, and previous unification attempts broke the CSS layout during scrolling.
  - **New behavior**: The search overlay now uses a robust manual check that detects clicks outside *both* the normal and fixed search containers. This keeps the bar open when clicking the input and maintains perfect CSS consistency across all scroll states.
  - **Reason for change**: Fix reported bug while ensuring the design and layout remain exactly as intended by the user.

### Added

- `app/(core)/utils/GlobalFunctions/GlobalFunctions.js`: Added `IsUserLoggedIn` helper function.
  - **New behavior**: Provides a centralized, server-side (SSR) way to check if a user is authenticated by verifying `LoginUser` and `userLoginCookie` cookies.

### Modified

- Authentication Flow (SSR Validation): Implemented server-side redirects in all authentication-related page components to prevent logged-in users from accessing them.
  - **Files modified**: 
    - `app/(auth)/LoginOption/page.js`
    - `app/(auth)/ContinueWithEmail/[[...slug]]/page.js`
    - `app/(auth)/ContinueWithMobile/[[...slug]]/page.js`
    - `app/(auth)/LoginWithEmail/[[...search]]/page.js`
    - `app/(auth)/LoginWithEmailCode/[[...search]]/page.js`
    - `app/(auth)/LoginWithMobileCode/[[...search]]/page.js`
    - `app/(auth)/register/page.js`
    - `app/(auth)/forgotPass/[[...slug]]/page.js`
  - **Old behavior**: Logged-in users could access these pages via the browser back button or direct URL entry, sometimes causing a flash of the login screen before client-side logic kicked in.
  - **New behavior**: Page-level SSR validation immediately redirects authenticated users to the home page (`/`) before any content is sent to the browser.
  - **Reason for change**: Improved security and user experience by ensuring robust, flicker-free protection of authentication routes without relying on middleware.

## [2026-03-20]


### Updated

- `app/theme/fgstore.web/appointment/page.js`: Implemented URL synchronization for appointment selection using `service` query parameter.
- `app/theme/fgstore.web/appointment/AppointmentForm.jsx`: Refactored form UI using Material UI components (`TextField`, `Button`, `Grid`, etc.) and implemented native `datetime-local` picker for better mobile support and responsiveness.
- `app/components/(static)/SubscribeNewsLater/NewsletterSignup.scss`: Fixed horizontal overflow on mobile devices by replacing fixed widths with responsive constraints and ensuring proper stacking of form elements.
- `app/components/(dynamic)/Account/Account.js`: Centered the Account page layout, including the title and tabs, to match the requested design.
- `app/components/(dynamic)/Header/Hoq/Navbar.js`, `MobileNavbar.js` & `Header.jsx`: Added logout confirmation dialog (reusing `LogOutModal`) and implemented `ClickAwayListener` in the search overlay for improved UX.
- Authentication Flow: Updated `AuthProvider.js`, Header components, and theme-specific login pages to use `router.replace` and `window.location.replace` instead of `push/href`. This prevents the browser back button from accessing unauthorized or redundant auth pages after login/logout.
- `app/components/(static)/Footer/FooterNew.js`: Implemented server-side parsing of social media links from `companyInfoData.SocialLinkObj` to ensure proper rendering without hydration errors.
- `app/theme/fgstore.web/product/page.scss`: Fixed the UI of metal color selection dots.
  - **Old behavior**: Dots appeared as ovals due to a mismatch between fixed height (20px) and relative width (28%).
  - **New behavior**: Dots are now perfectly rounded with a fixed size (responsive via `clamp`) and the selected state is much more distinct with a double-ring effect and enhanced shadow.
  - **Reason for change**: Improve UI/UX, visual consistency, and accessibility of the selected state.
- `app/theme/fgstore.web/product/_prodComponents/page.jsx`: Fixed persistent loading skeletons in the filter header when no products are found.
  - **Old behavior**: `afterCountStatus` remained `true` if the product list was empty, keeping skeletons visible in the filter labels.
  - **New behavior**: `afterCountStatus` is explicitly set to `false` whenever the product list updates, ensuring skeletons are cleared.
- `app/theme/fgstore.web/product/page.scss`: Restored visibility of long product titles on mobile devices.
  - **Old behavior**: Titles longer than 30 characters were hidden (`display: none`) on screens narrower than 560px.
  - **New behavior**: All titles are now visible and properly truncated with ellipsis if they exceed the available width.
- `app/theme/fgstore.web/Lookbook/new/DesignBlockView.jsx`: Fixed malformed JSX in `case 2` (Two-column view).
  - **Old behavior**: A syntax error in the conditional rendering caused literal characters `):(` and extra skeletons to be displayed at the bottom of the page.
  - **New behavior**: Corrected the conditional logic for `isPgLoading`, ensuring clean rendering and no extra characters or redundant skeletons.
- Improved overall responsiveness and layout of the appointment booking flow, newsletter signup, account page, and product listing breadcrumbs.
- **Image Pre-loading Optimization (fgstore.web)**: Implemented compressed metadata passing via URL query parameters (`p`) to enable immediate image rendering on the product detail page.
  - **Navigation Components Updated**: `NewArrival1.js`, `TrendingView1.js`, `DesignSet2.js`, `_prodComponents/page.jsx`, `useNavigation.js`, `Cart.js`, `Wishlist.js`, and `useLookBook.js`.
  - **Metadata Included**: `l` (ImageExtension) and `count` (ImageCount) are now passed in the compressed object.
  - **Safety Enhancement**: Added `encodeURIComponent` to all navigation URLs involving the compressed `p` parameter.
  - **Instant Rendering Implementation**: Refactored `ProductDetail` component to decode URL parameters synchronously and updated `useProductDetail` and `useImageHandler` hooks to initialize states during the first render. This achieves zero-delay image display, matching the premium performance of the `hoq.web` theme.
  - **NO IMAGE Flash Fix**: Removed a fallback `useEffect` in `useImageHandler.js` that was prematurely setting an empty image URL on mount, causing a "NO IMAGE" placeholder to flash before real data loaded. The skeleton now stays visible until images are ready.
  - **Old behavior**: Product detail page showed "NO IMAGE" placeholder briefly before images loaded due to a fallback effect firing before data was available.
  - **New behavior**: Skeleton loading state persists until images are ready. Images then appear instantly without any "NO IMAGE" flash.

### Fixed

- **Breadcrumb Spelling Fix**: Resolved issue where "category" was displayed as "categor" by fixing the `menuname` calculation in `BreadCrums.jsx` across all themes. This fix was applied across `fgstore.web`, `hoq.web`, and `fgstore.mapp`.
- **StoreInit Availability & Logout Fix**: Fixed a crash occurring after logout by implementing a robust synchronization mechanism in `Header.jsx` that re-hydrates `sessionStorage` from server props.
- **API Robustness**: Updated `CommonAPI.js` and `GetMenuAPI.js` with multi-layered fallbacks (sessionStorage -> window object) to ensure store configuration is always available without breaking Next.js server component rules.
- **Lookbook Hook Fix**: Fixed an "Invalid hook call" in `useLookBook.js` caused by a brace imbalance that prematurely closed the hook function, leaving subsequent hooks at the top level.

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

### [2026-03-23]

#### Added
- Fixed malformed code in `Header.jsx` caused by manual edits (resolved syntax errors like `valugetMenuApi`).
- Re-implemented standardized Menu Caching in `Header.jsx` mirroring the mobile app's menu logic with `PackageId` focus.
- Restored original B2B/B2C conditional guard for menu fetching in `Header.jsx`.
- Implemented Home Page Caching Demo in `SonasonsHome` using Next.js 15 `unstable_cache`.
- Upgraded `AlbumSection/Main.jsx` with robust 5-step caching validation (local vs server metadata) and global `cacheList` sync.
- Upgraded `BestSellerSection1.js` with robust 5-step caching validation (local vs server metadata) and global `cacheList` sync using `fg_bestseller` prefix.
- Upgraded `NewArrival1.js` with robust 5-step caching validation (local vs server metadata) and global `cacheList` sync using `fg_newarrival` prefix.
- Upgraded `TrendingView1.js` with robust 5-step caching validation (local vs server metadata) and global `cacheList` sync using `fg_trending` prefix.
- Upgraded `DesignSet2.js` with robust 5-step caching validation (local vs server metadata) and global `cacheList` sync using `fg_designset` prefix.

#### Fixed
- Updated Combo APIs (`MetalType`, `DiamondQualityColor`, `MetalColor`, `ColorStoneQualityColor`, `Currency`) to use `getSessionAsync` for robust data fetching.
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
- 2026-03-20: [FGSTORE.WEB/PRODUCT] Fixed Diamond Weight filter logic to use flexible matching for varying API filter names (e.g. DiamondWt).
- 2026-03-20: [CORE/CONTEXTS] Fixed Guest Session Isolation issue where all guest users shared the same wishlist/cart. Now generating unique `visiterId` for each guest.
- 2026-03-20: [HEADER/PRODUCT/WISHLIST] Fixed crash on logout and improved StoreInit data availability using robust fallbacks.
- `app/(core)/contexts/MasterProvider.js`: Restored and refined token-based login logic for the `nxtmobileapp.web` domain, ensuring correct redirection to the home page or intended destination in mobile webview mode.

### [2026-02-27]

#### Modified

- `app/theme/fgstore.mapp/home/components/GiftBlock.jsx`: Refactored for performance and UI consistency. Removed unused state, added Header component, and improved image handling.
