# Customization Drawer — Article-Based Combination Selection

## Background

The product detail API (`GETPRODUCTARTICLE`) returns:
- **`rd1`** — one row per `ArticleId` with `MetalTypeId`, `MetalType`, `MetalColorId`, `MetalColor`, `Size`
- **`rd2`** — one or more rows per `ArticleId` with `StoneTypeid`, `Quality`, `Color`

From these two arrays we must derive three picker sections in the **CustomizerDrawer**:

| Section | Source | Logic |
|---|---|---|
| **Choice of Metal** | `rd1` | Unique `MetalTypeId + MetalColorId` combos (label = `MetalType + Color`) |
| **Size** | `rd1` | Sizes available for the **selected** metal combo articles |
| **Diamond Quality** | `rd2` | Unique `Quality + Color` combos for `StoneTypeid !== 4` (metal rows excluded) across all articles matching selected metal **AND** selected size |

> **Note**: The user said Diamond Quality is "fully based on StoneTypeId" — so we derive it from `rd2` records (excluding `StoneTypeid === 4` which is METAL).

---

## User Review Required

> [!IMPORTANT]
> **ArticleId pass-through from listing → detail page**
> Currently `handleMoveToDetail` in `ProductList.js` already stores `ArticleNo` in the encoded URL param. However to also set a **default article for the customizer**, we need to pass the `ArticleId` (from the clicked product's data).  
> Please confirm: does the product listing data include `ArticleId` on each card, or only `ArticleNo` / `autocode`?

> [!IMPORTANT]
> **Drawer vs. inline UI**
> The screenshot shows a right-side drawer (existing `CustomizerDrawer`). We will **replace the mock data** in the drawer with live derived combinations. The `Customize Design` button on RightSide already opens this drawer. Do you want the selection in the drawer to also **update the price on the main page** (call `handleCustomChange`) when Confirm is clicked?

---

## Open Questions

1. Should selecting a metal combo in the drawer auto-call `handleCustomChange` to refresh price, or only apply on "Confirm Customisation" click?
2. When `Size === ""` (empty) in `rd1`, should that article appear as a "No Size / One-Size" option?
3. Should the Diamond Quality picker filter to only the stones matching the **currently selected ArticleId**, or show all unique combos across the design?

---

## Proposed Changes

### Component: CustomizerDrawer

#### [MODIFY] [index.js](file:///f:/next-ecomm(apilx)/app/theme/beluxjewel.web/detail/ProductDetail/Customiziation/index.js)

Replace the **static mock data** with derived live data:

**New props to accept:**
```
rd1        — articles array from API (MetalType, MetalColor, Size, ArticleId)
rd2        — stones array from API (StoneTypeid, Quality, Color, ArticleId)
defaultArticleId — pre-selected ArticleId (passed from listing page)
onConfirm  — callback(articleId, sizeValue) when user clicks Confirm
```

**Derived logic (inside the drawer):**
```js
// 1. Unique metal combos from rd1
const metalCombos = useMemo(() => {
  const seen = new Set();
  return rd1.filter(row => {
    const key = `${row.MetalTypeId}-${row.MetalColorId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}, [rd1]);

// 2. Articles that match selected metal combo
const matchingArticles = useMemo(() =>
  rd1.filter(r => r.MetalTypeId === selectedMetal?.MetalTypeId &&
                  r.MetalColorId === selectedMetal?.MetalColorId),
[rd1, selectedMetal]);

// 3. Available sizes for the selected metal
const sizes = useMemo(() =>
  matchingArticles.map(r => r.Size).filter(Boolean),
[matchingArticles]);

// 4. Active ArticleId based on metal + size selection
const activeArticleId = useMemo(() => {
  const match = matchingArticles.find(r => r.Size === selectedSize);
  return match?.ArticleId ?? matchingArticles[0]?.ArticleId;
}, [matchingArticles, selectedSize]);

// 5. Diamond quality combos from rd2 for active articles
const diaQualityCombos = useMemo(() => {
  const relevantIds = matchingArticles.map(r => r.ArticleId);
  const seen = new Set();
  return rd2.filter(r =>
    relevantIds.includes(r.ArticleId) && r.StoneTypeid !== 4
  ).filter(r => {
    const key = `${r.Quality}-${r.Color}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}, [rd2, matchingArticles]);
```

**UI changes:**
- Metal pills: dynamic from `metalCombos`
- Size pills: dynamic from `sizes`; if empty → hide size section
- Diamond Quality: dynamic from `diaQualityCombos`; label = `Quality - Color`
- Price header: use real price from the `rd1` row matching `activeArticleId`
- Confirm button: calls `onConfirm(activeArticleId, selectedSize, selectedDiaQc)`

---

### Component: RightSide → ProductDetail

#### [MODIFY] [RightSide.jsx](file:///f:/next-ecomm(apilx)/app/theme/beluxjewel.web/detail/ProductDetail/New/RightSide.jsx)

Add new props:
- `rd1` — raw articles
- `rd2` — raw stones
- `defaultArticleId` — pre-selected article from listing
- `onCustomizerConfirm` — passed to drawer

Pass to `<CustomizerDrawer>`:
```jsx
<CustomizerDrawer
  open={isCustomizerOpen}
  onClose={() => setIsCustomizerOpen(false)}
  rd1={rd1}
  rd2={rd2}
  defaultArticleId={defaultArticleId}
  onConfirm={onCustomizerConfirm}
/>
```

---

#### [MODIFY] [ProductDetail.js](file:///f:/next-ecomm(apilx)/app/theme/beluxjewel.web/detail/ProductDetail/ProductDetail.js)

1. **Fetch `rd1` and `rd2`** from the product detail API response (they come from `SingleArticleProdListAPI` via `res?.pdResp?.rd1` / `res?.pdResp?.rd2`)  
   - Store them in `useState`: `const [rd1Data, setRd1Data] = useState([])`  
   - Store them in `useState`: `const [rd2Data, setRd2Data] = useState([])`

2. **Extract `defaultArticleId`** from the decoded URL param `initialDecodeUrl?.ArticleId` (this is where we'll put it when navigating from listing).

3. **Pass to `<RightSide>`**:
```jsx
rd1={rd1Data}
rd2={rd2Data}
defaultArticleId={defaultArticleId}
onCustomizerConfirm={handleCustomizerConfirm}
```

4. **`handleCustomizerConfirm`** — when the drawer's Confirm is clicked:
```js
const handleCustomizerConfirm = (articleId, size, diaQc) => {
  // trigger price refresh for chosen articleId
  setSizeData(size);
  // map articleId back to metal/dia combos and call handleCustomChange
};
```

---

### Navigation: Listing → Detail (ArticleId pass-through)

#### [MODIFY] [ProductList.js](file:///f:/next-ecomm(apilx)/app/theme/beluxjewel.web/product/ProductList/ProductList.js)

In `handleMoveToDetail`, add `ArticleId` to the encoded object:
```js
let obj = {
  a: productData?.autocode,
  b: productData?.designno,
  ArticleId: productData?.ArticleId,  // ← ADD THIS
  ...
};
```

---

## Verification Plan

### Manual Verification
1. Navigate from product listing → detail page, confirm `ArticleId` is in the URL param
2. Open "Customize Design" drawer — verify metal combos are derived from live `rd1`
3. Select a metal, verify sizes update to only those available for that metal
4. Select a size, verify `activeArticleId` is resolved correctly
5. Verify Diamond Quality shows unique combos excluding StoneTypeid=4 (metal)
6. Click "Confirm" — verify the right `ArticleId` / size is returned
