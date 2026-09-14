/**
 * Table Schema: designs
 * Jewelry Designs / Product Listing & Multi-Filter Indexes
 */
export const DESIGNS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS designs (
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

-- Fast Indexing on designs
CREATE INDEX IF NOT EXISTS idx_designs_article ON designs(ArticleNo);
CREATE INDEX IF NOT EXISTS idx_designs_designno ON designs(designno);
CREATE INDEX IF NOT EXISTS idx_designs_autocode ON designs(autocode);

-- Single-column NOCASE indexes for ultra-fast filtering
CREATE INDEX IF NOT EXISTS idx_designs_gender_nc ON designs(gender COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_category_nc ON designs(category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_collection_nc ON designs(collection COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_subcategory_nc ON designs(sub_category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_brand_nc ON designs(brand COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_style_nc ON designs(style COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_product_type_nc ON designs(product_type COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_occasion_nc ON designs(occasion COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_make_type_nc ON designs(make_type COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_metal_color ON designs(MetalColorid);

-- Compound / Multi-column NOCASE indexes for multi-filter combinations
CREATE INDEX IF NOT EXISTS idx_designs_gender_category ON designs(gender COLLATE NOCASE, category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_gender_collection ON designs(gender COLLATE NOCASE, collection COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_gender_brand ON designs(gender COLLATE NOCASE, brand COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_gender_subcat ON designs(gender COLLATE NOCASE, sub_category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_gender_cat_subcat ON designs(gender COLLATE NOCASE, category COLLATE NOCASE, sub_category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_gender_coll_cat ON designs(gender COLLATE NOCASE, collection COLLATE NOCASE, category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_category_subcat ON designs(category COLLATE NOCASE, sub_category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_collection_subcat ON designs(collection COLLATE NOCASE, sub_category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_brand_category ON designs(brand COLLATE NOCASE, category COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_brand_collection ON designs(brand COLLATE NOCASE, collection COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_product_type_gender ON designs(product_type COLLATE NOCASE, gender COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_occasion_gender ON designs(occasion COLLATE NOCASE, gender COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_style_gender ON designs(style COLLATE NOCASE, gender COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_designs_cat_price ON designs(category COLLATE NOCASE, UnitCostWithMarkUpIncTax ASC);

-- Sorting optimization indexes
CREATE INDEX IF NOT EXISTS idx_designs_sort_display ON designs(DisplayOrder ASC, id ASC);
CREATE INDEX IF NOT EXISTS idx_designs_sort_price_asc ON designs(UnitCostWithMarkUpIncTax ASC, DisplayOrder ASC);
CREATE INDEX IF NOT EXISTS idx_designs_sort_price_desc ON designs(UnitCostWithMarkUpIncTax DESC, DisplayOrder ASC);
CREATE INDEX IF NOT EXISTS idx_designs_sort_new ON designs(EntryDate DESC, id DESC);
`;

export default DESIGNS_TABLE_SQL;
