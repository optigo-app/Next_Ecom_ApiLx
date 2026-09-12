# Comprehensive E-Commerce SQLite Data Specification & Gap Analysis

This document serves as the master specification for the SQLite-backed catalog, filtering, sorting, menu hierarchy, cart, wishlist, stock inventory, and external push sync architecture.

---

## 1. Reference: Current Base `designs` Table Schema

```sql
CREATE TABLE designs (
    id INTEGER,
    SrNo TEXT,
    DesignId INTEGER,
    ArticleNo TEXT NOT NULL UNIQUE,
    designno TEXT,
    autocode TEXT,
    TitleLine TEXT,
    description TEXT,
    DisplayOrder INTEGER DEFAULT 0,
    IsBestSeller INTEGER DEFAULT 0,
    IsTrending INTEGER DEFAULT 0,
    IsNewArrival INTEGER DEFAULT 0,
    IsInReadyStock INTEGER DEFAULT 0,
    IsMrpBase INTEGER DEFAULT 1,
    EntryDate DATETIME,
    FrontEnd1_newArrivalsto DATETIME,
    DiaQuaCol TEXT,
    CsQuaCol TEXT,
    SoldCnt INTEGER DEFAULT 0,
    Nwt DECIMAL(18,3),
    Gwt DECIMAL(18,3),
    Dwt DECIMAL(18,3),
    Dpcs INTEGER DEFAULT 0,
    CSwt DECIMAL(18,3),
    CSpcs INTEGER DEFAULT 0,
    UnitCost DECIMAL(18,2),
    UnitCostWithMarkUp DECIMAL(18,2),
    UnitCostWithMarkUpIncTax DECIMAL(18,2),
    Metal_Cost DECIMAL(18,2),
    Labour_Cost DECIMAL(18,2),
    Diamond_Cost DECIMAL(18,2),
    Diamond_SettingCost DECIMAL(18,2),
    ColorStone_Cost DECIMAL(18,2),
    ColorStone_SettingCost DECIMAL(18,2),
    Misc_Cost DECIMAL(18,2),
    Misc_SettingCost DECIMAL(18,2) DEFAULT 0,
    Other_Cost DECIMAL(18,2),
    SolPrice DECIMAL(18,2) DEFAULT 0,
    MetalPurityid INTEGER,
    MetalColorid INTEGER,
    MetalTypeid INTEGER,
    MetalTypePurity TEXT,
    CartId INTEGER,
    IsInWish INTEGER DEFAULT 0,
    IsInCart INTEGER DEFAULT 0,
    ImageCount INTEGER DEFAULT 0,
    ColorImageCount INTEGER DEFAULT 0,
    "360ImageCount" INTEGER DEFAULT 0,
    VideoCount INTEGER DEFAULT 0,
    ImageExtension TEXT DEFAULT 'png',
    "360ImageExtension" TEXT,
    VideoExtension TEXT,
    IsImageNameWithRandNo INTEGER DEFAULT 0,
    ImageVideoDetail TEXT,
    category TEXT,
    collection TEXT,
    sub_category TEXT,
    gender TEXT,
    brand TEXT,
    occasion TEXT,
    product_type TEXT,
    style TEXT,
    make_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_designs_article UNIQUE (ArticleNo)
);
```

---

## 2. Raw Source API Payload References

### 2.1 `GETMENU` API (Menu Hierarchy & Filter Routing)
```json
[
  {
    "SrNo": "1",
    "id": 44,
    "levelid": 2,
    "menuid": 9,
    "menuname": "Jewellery",
    "IsHashTag": 0,
    "link": "",
    "displayorder": 1,
    "param0id": 0,
    "param0name": "Auto",
    "param0dataid": 0,
    "param0dataname": "",
    "param1id": 1,
    "param1name": "collection",
    "param1dataid": 4,
    "param1dataname": "Generous",
    "param2id": 2,
    "param2name": "category",
    "param2dataid": 1,
    "param2dataname": "RING",
    "IsFilterKey1Ignore": 0
  }
]
```

### 2.2 First-Level Navigation Categories
1. `Jewellery` (Level 1)
2. `High Collection` (Level 1)
3. `New Arrivals` (Level 1)
4. `Collection` (Level 1)
5. `Marketing Support` (Level 1)

### 2.3 `GETFILTERLIST` API (Facet Filter Definitions)
```json
[
  {
    "id": "collection",
    "Name": "Collection",
    "options": "[{\"id\":8,\"Name\":\"Anemone\"},{\"id\":9,\"Name\":\"Artifact\"},{\"id\":12,\"Name\":\"Euclid\"},{\"id\":18,\"Name\":\"Mingle\"},{\"id\":20,\"Name\":\"Rebellious\"}]",
    "Fil_No": 15,
    "Fil_DisName": "Collection"
  }
]
```

### 2.4 Product Article & Variants Detail API (`rd` Parent & `rd1` Variant Breakdown)
```json
{
  "rd": [
    {
      "id": 10128,
      "DesignId": 10128,
      "autocode": "10128",
      "designno": "ZG401",
      "TitleLine": "",
      "description": "",
      "ImageCount": 1,
      "ColorImageCount": 0,
      "360ImageCount": 0,
      "VideoCount": 0,
      "ImageExtension": "webp",
      "360ImageExtension": "",
      "VideoExtension": "",
      "IsImageNameWithRandNo": 0,
      "ImageVideoDetail": "[{\"Nm\":1,\"Ex\":\"webp\",\"CN\":\"\",\"TI\":1}]"
    }
  ],
  "rd1": [
    {
      "autocode": "10128",
      "designno": "ZG401",
      "ArticleId": 327333,
      "ArticleNo": "ZG401-024",
      "MetalWeight": 3.757,
      "FindingWeight": null,
      "NetWeight": 3.757,
      "TotalDiamondPcs": 0,
      "ActualDiamondWeight": 0,
      "DiamondWeightWithLoss": 0,
      "TotalColorStonePcs": 0,
      "ActualColorStoneWeight": 0,
      "CsaddinnetWeight": 0,
      "CsappliedWeight": 0,
      "TotalMiscPcs": 0,
      "TotalMiscWeight": 0,
      "TotalMiscWeight_addingrossWeight": 0,
      "MiscaddinnetWeight": 0,
      "MiscappliedWeight": 0,
      "ActualGrossWeight": 3.757,
      "GrossWeightWithLoss": 3.757,
      "IsMrpBase": 0,
      "MetalRateOnId": 0,
      "MakingChargeOnId": 0,
      "Metalrate": 6250.5,
      "MakingCharge": 800,
      "TotalMetalCost": 23483.129,
      "TotalDiamondCost": 0,
      "TotalColorStoneCost": 0,
      "TotalMiscCost": 0,
      "TotalMakingCost": 3005.6,
      "TotalOtherCost": 0,
      "TotalSettingCost": 0,
      "TotalDiamondhandlingCost": 0,
      "CurrencyRate": null,
      "TotalUnitCost": 26488.73,
      "MarkUp": null,
      "UnitCostWithmarkup": 26488.73,
      "Discount": 0,
      "MRP": 0,
      "ToolItemId": 0,
      "TotalCSSettingCost": 0,
      "TotalDiaSettingCost": 0,
      "MetalTypeId": 5,
      "MetalType": "GOLD 10K",
      "MetalColorId": 9,
      "MetalColor": "YELLOW",
      "Size": "",
      "CartId": 0,
      "IsInWish": 0,
      "IsInCart": 0,
      "CartQuantity": 0,
      "Remarks": "",
      "InStock": 0,
      "StockBarcode": ""
    }
  ]
}
```

### 2.5 `GETWISHLIST` API
```json
[
  {
    "icount": 1,
    "totalDiaWt": 0,
    "totalCSWt": 0,
    "totalGrossweight": 3.76,
    "totalfinewt": 3.76,
    "TotalUnitCost": 26488.73,
    "TotalQuantity": 1,
    "SrNo": "1",
    "id": 281,
    "DesignId": 8148,
    "ArticleNo": "ZD011-022",
    "designno": "ZD011",
    "autocode": "8223",
    "metaltypeid": 5,
    "metaltypename": "GOLD 10K",
    "metal": "GOLD 10K",
    "metalpurityname": "14K",
    "Purity": "14K",
    "metalcolorid": 9,
    "metalcolorname": "YELLOW",
    "diamondqualityid": 3,
    "diamondquality": "VVS",
    "diamondqualityname": "VVS",
    "diamondcolorid": 7,
    "diamondcolor": "IJ",
    "diamondcolorname": "IJ",
    "colorstonequalityid": 0,
    "colorstonequality": "",
    "colorstonequalityname": "",
    "colorstonecolorid": 0,
    "colorstonecolor": "",
    "colorstonecolorname": "",
    "Quantity": 1,
    "Size": "",
    "StockId": 0,
    "Remarks": "",
    "OrderRemarks": "",
    "SizeMarkUp": 0,
    "TitleLine": "",
    "shipsdate": "08 Sep 2026",
    "shipsoutdate": "08 Sep 2026",
    "IsInCart": 0,
    "CW_Gwt": 3.757,
    "CW_Nwt": 3.757,
    "CW_Dwt": 0,
    "CW_Dpcs": 0,
    "CW_CSwt": 0,
    "CW_CSpcs": 0,
    "CW_UCost": 26488.73,
    "CW_Quantity": 1,
    "CW_UCostWM": 26488.73,
    "StockNo": "",
    "IsMrpBase": 0,
    "Sol_StockNo": "",
    "_UnitCost": 26488.73,
    "Metal_Cost": 23483.13,
    "Labour_Cost": 3005.6,
    "Diamond_Cost": 0,
    "Diamond_SettingCost": 0,
    "ColorStone_Cost": 0,
    "ColorStone_SettingCost": 0,
    "Misc_Cost": 0,
    "Misc_SettingCost": 0,
    "Other_Cost": 0,
    "SolPrice": 0,
    "UnitCostWithMarkUp": 26488.73,
    "UnitCostWithMarkUpIncTax": 26488.73,
    "DWt": 0,
    "CsWt": 0,
    "Gwt": 3.757,
    "Nwt": 3.757,
    "ImageCount": 1,
    "ImageExtension": "webp",
    "IsImageNameWithRandNo": 0,
    "FinalCost": 26488.73,
    "FinalCostIncTax": 26488.73
  }
]
```

### 2.6 `GETCART` API
```json
[
  {
    "icount": 58,
    "totalDiaWt": 33.22,
    "totalCSWt": 13.13,
    "totalGrossweight": 297.62,
    "totalfinewt": 288.38,
    "TotalUnitCost": 2039231.98,
    "TotalQuantity": 58,
    "SrNo": "1",
    "id": 35,
    "DesignId": 155,
    "ArticleNo": "EA114001-045",
    "designno": "EA114001",
    "autocode": "155",
    "metaltypeid": null,
    "metaltypename": " ",
    "metal": " ",
    "metalpurityname": "14K",
    "Purity": "14K",
    "metalcolorid": null,
    "metalcolorname": "",
    "diamondqualityid": 3,
    "diamondquality": "VVS",
    "diamondqualityname": "VVS",
    "diamondcolorid": 7,
    "diamondcolor": "IJ",
    "diamondcolorname": "IJ",
    "colorstonequalityid": 0,
    "colorstonequality": "",
    "colorstonequalityname": "",
    "colorstonecolorid": 0,
    "colorstonecolor": "",
    "colorstonecolorname": "",
    "Quantity": 1,
    "Size": "",
    "StockId": 0,
    "Remarks": "",
    "OrderRemarks": "",
    "SizeMarkUp": 0,
    "TitleLine": "",
    "shipsdate": "08 Sep 2026",
    "shipsoutdate": "08 Sep 2026",
    "CW_Gwt": 0,
    "CW_Nwt": 0,
    "CW_Dwt": 0,
    "CW_Dpcs": 0,
    "CW_CSwt": 0,
    "CW_CSpcs": 0,
    "CW_UCost": 0,
    "CW_Quantity": 1,
    "CW_UCostWM": 0,
    "StockNo": "",
    "IsMrpBase": 0,
    "Sol_StockNo": "",
    "_UnitCost": 0,
    "Metal_Cost": 0,
    "Labour_Cost": 0,
    "Diamond_Cost": 0,
    "Diamond_SettingCost": 0,
    "ColorStone_Cost": 0,
    "ColorStone_SettingCost": 0,
    "Misc_Cost": 0,
    "Misc_SettingCost": 0,
    "Other_Cost": 0,
    "SolPrice": 0,
    "UnitCostWithMarkUp": 0,
    "UnitCostWithMarkUpIncTax": 0,
    "DWt": 0,
    "CsWt": 0,
    "Gwt": 0,
    "Nwt": 0,
    "ImageCount": 1,
    "ImageExtension": "webp",
    "IsImageNameWithRandNo": 0,
    "FinalCost": 0,
    "FinalCostIncTax": 0
  }
]
```

---

## 3. Comprehensive Field-by-Field Gap Analysis

This table audits **every field from the live APIs** against your current reference `designs` schema and specifies what is **Available**, what is **Missing**, and how to map it.

| API / Feature Area | Raw API Field Name | Field Data Type | Current `designs` Schema Status | Proposed Mapping / Target Column | Purpose & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Catalog Master** | `DesignId` | INTEGER | **AVAILABLE** (`DesignId`) | `designs.DesignId` | Unique Design Master ID |
| **Catalog Master** | `ArticleNo` | TEXT | **AVAILABLE** (`ArticleNo`) | `designs.ArticleNo` | Unique SKU / Article Number |
| **Catalog Master** | `designno` | TEXT | **AVAILABLE** (`designno`) | `designs.designno` | Style Code (e.g., 'ZG401') |
| **Catalog Master** | `autocode` | TEXT | **AVAILABLE** (`autocode`) | `designs.autocode` | Alphanumeric Lookup Code |
| **Catalog Master** | `TitleLine` | TEXT | **AVAILABLE** (`TitleLine`) | `designs.TitleLine` | Product Display Title |
| **Catalog Master** | `description` | TEXT | **AVAILABLE** (`description`) | `designs.description` | Detailed Description / HTML |
| **Catalog Master** | `category` | TEXT | **AVAILABLE** (`category`) | `designs.category` | Ring, Earring, Pendant, etc. |
| **Catalog Master** | `collection` | TEXT | **AVAILABLE** (`collection`) | `designs.collection` | Generous, Anemone, Artifact, etc. |
| **Catalog Master** | `sub_category` | TEXT | **AVAILABLE** (`sub_category`) | `designs.sub_category` | Sub-category grouping |
| **Catalog Master** | `gender` | TEXT | **AVAILABLE** (`gender`) | `designs.gender` | Women, Men, Unisex |
| **Catalog Master** | `brand` | TEXT | **AVAILABLE** (`brand`) | `designs.brand` | Brand name |
| **Catalog Master** | `occasion` | TEXT | **AVAILABLE** (`occasion`) | `designs.occasion` | Bridal, Daily, Party, etc. |
| **Catalog Master** | `product_type` | TEXT | **AVAILABLE** (`product_type`) | `designs.product_type` | Fine Jewelry, Solitaire, etc. |
| **Catalog Master** | `style` | TEXT | **AVAILABLE** (`style`) | `designs.style` | Halo, Solitaire, Three-Stone, etc. |
| **Catalog Master** | `make_type` | TEXT | **AVAILABLE** (`make_type`) | `designs.make_type` | Cast, Handmade, 3D Printed |
| **Flags & Badges** | `IsBestSeller` | INTEGER | **AVAILABLE** (`IsBestSeller`) | `designs.IsBestSeller` | 1 = Best Seller badge |
| **Flags & Badges** | `IsTrending` | INTEGER | **AVAILABLE** (`IsTrending`) | `designs.IsTrending` | 1 = Trending badge |
| **Flags & Badges** | `IsNewArrival` | INTEGER | **AVAILABLE** (`IsNewArrival`) | `designs.IsNewArrival` | 1 = New Arrival badge |
| **Flags & Badges** | `IsInReadyStock` | INTEGER | **AVAILABLE** (`IsInReadyStock`)| `designs.IsInReadyStock` | 1 = Ready stock flag on Design |
| **Weights & Costs** | `Nwt` / `Gwt` / `Dwt` | DECIMAL | **AVAILABLE** (`Nwt`,`Gwt`,`Dwt`)| `designs.Nwt`, `Gwt`, `Dwt` | Default physical weights |
| **Pricing** | `UnitCostWithMarkUpIncTax` | DECIMAL | **AVAILABLE** | `designs.UnitCostWithMarkUpIncTax` | Default Price displayed on catalog |
| **Pricing** | `SolPrice` | DECIMAL | **AVAILABLE** (`SolPrice`) | `designs.SolPrice` | Solitaire base price |
| **Media Assets** | `ImageCount` / `ImageExtension` | INTEGER/TEXT | **AVAILABLE** | `designs.ImageCount`, `ImageExtension` | Primary images count & format |
| **Media Assets** | `ImageVideoDetail` | TEXT (JSON) | **AVAILABLE** | `designs.ImageVideoDetail` | Array of image filenames & color associations |
| **Variant Breakdown (`rd1`)** | `ArticleId` | INTEGER | **MISSING in `designs`** | `design_articles.ArticleId` | Unique ID for each metal/diamond variant |
| **Variant Breakdown (`rd1`)** | `MetalWeight` | DECIMAL | **MISSING in `designs`** | `design_articles.MetalWeight` | Pure metal weight in variant |
| **Variant Breakdown (`rd1`)** | `FindingWeight` | DECIMAL | **MISSING in `designs`** | `design_articles.FindingWeight` | Clasps, screws, finding weights |
| **Variant Breakdown (`rd1`)** | `DiamondWeightWithLoss` | DECIMAL | **MISSING in `designs`** | `design_articles.DiamondWeightWithLoss`| Diamond gross weight including setting loss |
| **Variant Breakdown (`rd1`)** | `Metalrate` | DECIMAL | **MISSING in `designs`** | `design_articles.Metalrate` | Gold/Platinum rate per gram applied |
| **Variant Breakdown (`rd1`)** | `MakingCharge` | DECIMAL | **MISSING in `designs`** | `design_articles.MakingCharge` | Labour charge per gram or piece |
| **Variant Breakdown (`rd1`)** | `TotalMetalCost` | DECIMAL | **AVAILABLE as `Metal_Cost`** | `design_articles.TotalMetalCost` | Calculated total metal value |
| **Variant Breakdown (`rd1`)** | `TotalMakingCost` | DECIMAL | **AVAILABLE as `Labour_Cost`**| `design_articles.TotalMakingCost` | Total making cost |
| **Variant Breakdown (`rd1`)** | `TotalDiamondCost` | DECIMAL | **AVAILABLE as `Diamond_Cost`**| `design_articles.TotalDiamondCost` | Total diamond cost |
| **Variant Breakdown (`rd1`)** | `TotalSettingCost` | DECIMAL | **MISSING in `designs`** | `design_articles.TotalSettingCost`| Total gemstone setting charge |
| **Variant Breakdown (`rd1`)** | `Size` | TEXT | **MISSING in `designs`** | `design_articles.Size` | Ring size / Bangle size of variant |
| **Variant Breakdown (`rd1`)** | `InStock` | INTEGER | **MISSING in `designs`** (only has `IsInReadyStock`) | `design_articles.InStock` | 1 if this specific variant is in stock |
| **Variant Breakdown (`rd1`)** | `StockBarcode` | TEXT | **MISSING in `designs`** | `design_articles.StockBarcode` | Barcode label for ready stock item |
| **Menu System (`GETMENU`)** | `menuid` | INTEGER | **MISSING in `designs`** | `menus.menuid` | Logical Menu Section ID |
| **Menu System (`GETMENU`)** | `levelid` | INTEGER | **MISSING in `designs`** | `menus.levelid` | 1 = Top Level (Jewellery, New Arrivals), 2 = Submenu |
| **Menu System (`GETMENU`)** | `menuname` | TEXT | **MISSING in `designs`** | `menus.menuname` | Menu title displayed in Navbar |
| **Menu System (`GETMENU`)** | `displayorder` | INTEGER | **MISSING in `designs`** | `menus.displayorder` | Sort order in navigation bar |
| **Menu System (`GETMENU`)** | `param0name` / `param0dataname` | TEXT | **MISSING in `designs`** | `menus.param0name`, `param0dataname` | Filter parameter 0 key/value |
| **Menu System (`GETMENU`)** | `param1name` / `param1dataname` | TEXT | **MISSING in `designs`** | `menus.param1name`, `param1dataname` | Filter parameter 1 (e.g. collection=Generous) |
| **Menu System (`GETMENU`)** | `param2name` / `param2dataname` | TEXT | **MISSING in `designs`** | `menus.param2name`, `param2dataname` | Filter parameter 2 (e.g. category=RING) |
| **Menu System (`GETMENU`)** | `IsFilterKey1Ignore` | INTEGER | **MISSING in `designs`** | `menus.IsFilterKey1Ignore` | Flag to ignore primary filter key |
| **Filters (`GETFILTERLIST`)** | `Fil_No` | INTEGER | **MISSING in `designs`** | `menu_filters.fil_no` | Accordion sequence on filter sidebar |
| **Filters (`GETFILTERLIST`)** | `Fil_DisName` | TEXT | **MISSING in `designs`** | `menu_filters.fil_dis_name` | Filter label on UI (e.g. 'Collection') |
| **Filters (`GETFILTERLIST`)** | `options` | TEXT (JSON) | **MISSING in `designs`** | `menu_filters.options_json` | JSON options list `[{"id":8,"Name":"Anemone"}]` |
| **Cart (`GETCART`)** | `cart_session_id` / `user_id` | TEXT / INT | **MISSING in `designs`** | `cart_items.cart_session_id` | Cart owner session/user identifier |
| **Cart (`GETCART`)** | `Quantity` | INTEGER | **MISSING in `designs`** | `cart_items.Quantity` | Selected quantity in shopping bag |
| **Cart (`GETCART`)** | `Size` / `SizeMarkUp` | TEXT / DECIMAL | **MISSING in `designs`** | `cart_items.Size`, `SizeMarkUp` | Finger size selected & custom size surcharge |
| **Cart (`GETCART`)** | `Remarks` / `OrderRemarks` | TEXT | **MISSING in `designs`** | `cart_items.Remarks`, `OrderRemarks` | Custom engraving or order notes |
| **Cart (`GETCART`)** | `FinalCost` / `FinalCostIncTax` | DECIMAL | **MISSING in `designs`** | `cart_items.FinalCost`, `FinalCostIncTax` | Final checkout cost with markup & tax |
| **Cart / Stock (`GETCART`)** | `StockId` / `StockNo` / `Sol_StockNo` | INT / TEXT | **MISSING in `designs`** | `cart_items.StockId`, `StockNo`, `Sol_StockNo` | Specific stock piece assigned to order |
| **Cart / Stock (`GETCART`)** | `shipsdate` / `shipsoutdate` | TEXT (Date) | **MISSING in `designs`** | `cart_items.shipsdate`, `shipsoutdate` | Dispatch promise date |
| **Wishlist (`GETWISHLIST`)** | `wishlist_session_id` | TEXT | **MISSING in `designs`** | `wishlist_items.wishlist_session_id` | User/guest wishlist key |
| **Wishlist (`GETWISHLIST`)** | `IsInCart` | INTEGER | **AVAILABLE in `designs`** | `wishlist_items.IsInCart` | 1 if wishlist item was moved to cart |

---

## 4. Architectural Solution: Minimal & Clean SQLite Structure

To preserve your working single-table queries while providing full capability for **Multi-Variant switching, Menu Navigation, Cart, Wishlist, Stock barcodes, and Facet Filtering**, we maintain the following clean, modular structure:

```
+---------------------------------------------------------------------------------+
|                                 SQLITE DATABASE                                 |
+---------------------------------------------------------------------------------+
  |
  +---> designs (Base Catalog / Style Master - Used for Fast PLP, Search, Sorting)
  |
  +---> design_articles (rd1 Variant Specs, Specific Metal/Dia Options, Barcodes)
  |
  +---> menus (1st Level & Sub-Menu hierarchy, param0/1/2 filter query mappings)
  |
  +---> menu_filters (Filter Definitions & Options JSON from GETFILTERLIST)
  |
  +---> cart_items (Active shopping cart sessions, sizes, custom remarks, pricing)
  |
  +---> wishlist_items (User wishlists, saved variant specs, shipsdate)
  |
  +---> sync_logs (Push ingestion audit tracking, record counts, speed metrics)
```

---

## 5. External Push Sync Ingestion Architecture

External ERPs, background workers, or sync callers push data into SQLite through dedicated Next.js API route endpoints:

### 5.1 Push Flow Architecture

```
[ External Caller / ERP / Sync Service ]
                   |
                   | HTTP POST (JSON Payload + Auth Token)
                   v
  [/api/v1/sync/push] or [/api/sqlite/sync-all]
                   |
                   +---> Validates Domain & Tenant DB Connection
                   |
                   +---> Opens SQLite WAL Transaction
                   |        - Batch UPSERT `designs` (Parent Styles)
                   |        - Batch UPSERT `design_articles` (Variants)
                   |        - Batch UPSERT `menus` (Level 1 & Sub-menus)
                   |        - Batch UPSERT `menu_filters` (Filter Options)
                   |
                   +---> Writes Audit Record into `sync_logs`
                   |
                   +---> Executes `wal_checkpoint(PASSIVE)`
                   v
[ JSON Response: { status: "SUCCESS", total_synced: 1250, duration_ms: 84 } ]
```

### 5.2 Unified Ingestion Payload Format (Push Input Schema)

```json
{
  "domain": "default",
  "menuData": [
    {
      "id": 44,
      "levelid": 1,
      "menuid": 9,
      "menuname": "Jewellery",
      "displayorder": 1,
      "link": "",
      "IsHashTag": 0,
      "param1name": "collection",
      "param1dataname": "Generous",
      "param2name": "category",
      "param2dataname": "RING"
    }
  ],
  "filterData": [
    {
      "id": "collection",
      "Name": "Collection",
      "Fil_No": 15,
      "Fil_DisName": "Collection",
      "options": "[{\"id\":8,\"Name\":\"Anemone\"},{\"id\":9,\"Name\":\"Artifact\"}]"
    }
  ],
  "products": [
    {
      "rd": [
        {
          "DesignId": 10128,
          "designno": "ZG401",
          "autocode": "10128",
          "TitleLine": "Classic Gold Ring",
          "category": "RING",
          "collection": "Generous",
          "gender": "Women",
          "IsInReadyStock": 1,
          "IsBestSeller": 1,
          "IsNewArrival": 1,
          "UnitCostWithMarkUpIncTax": 26488.73,
          "ImageCount": 1,
          "ImageExtension": "webp",
          "ImageVideoDetail": "[{\"Nm\":1,\"Ex\":\"webp\",\"CN\":\"\",\"TI\":1}]"
        }
      ],
      "rd1": [
        {
          "ArticleId": 327333,
          "DesignId": 10128,
          "ArticleNo": "ZG401-024",
          "MetalType": "GOLD 10K",
          "MetalColor": "YELLOW",
          "Size": "14",
          "NetWeight": 3.757,
          "TotalUnitCost": 26488.73,
          "InStock": 1,
          "StockBarcode": "BC-10128-024"
        }
      ]
    }
  ]
}
```

---

## 6. Summary of Next Action Steps

1. **Verify Schema Alignment (`db/schema.js`)**:
   - Ensure `designs`, `design_articles`, `menus`, `menu_filters`, `cart_items`, `wishlist_items`, and `sync_logs` tables exist with correct indexes.
2. **Expose Ingestion Push Endpoint (`app/api/sqlite/sync-all/route.js`)**:
   - Provide high-speed batch push endpoint ready to receive catalog, menu, filter, and stock updates.
3. **Connect Frontend PLP & Menu Components**:
   - Query 1st-level and sub-menus from `menus` table and feed dynamic catalog queries directly from indexed SQLite tables.
