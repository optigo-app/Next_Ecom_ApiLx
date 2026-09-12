-- ====================================================================
-- Workspace SQL Query Scratchpad
-- Multi-Tenant SQLite: designs, menu_filters, and sync_logs
-- ====================================================================

-- 1. View Table Schema Info & Index Constraints
PRAGMA table_info(designs);
PRAGMA index_list(designs);
PRAGMA table_info(menu_filters);
PRAGMA table_info(sync_logs);

-- 2. Query Distinct Designs with Categorical Attributes
SELECT id, ArticleNo, designno, autocode, category, collection, sub_category, gender, brand, occasion, product_type, style, make_type, UnitCostWithMarkUpIncTax
FROM designs
ORDER BY designno ASC
LIMIT 20;

-- 3. Query Designs by Category and Gender (No Duplicates)
SELECT ArticleNo, designno, autocode, category, gender, collection, sub_category, UnitCostWithMarkUpIncTax
FROM designs
WHERE category = 'Earring'
  AND gender = 'Women'
ORDER BY designno ASC;

-- 4. Query Designs with Dynamic Filters (Price & Metal Color)
SELECT ArticleNo, designno, category, gender, UnitCostWithMarkUpIncTax, MetalColorid, Gwt, Nwt
FROM designs
WHERE category = 'Ring'
  AND UnitCostWithMarkUpIncTax BETWEEN 10000 AND 200000
  AND MetalColorid = 2
ORDER BY UnitCostWithMarkUpIncTax ASC;

-- 5. Check Stored Filter Options for a Menu
SELECT filter_id, name, fil_dis_name, fil_no, options_json
FROM menu_filters
ORDER BY fil_no ASC;

-- 6. View Sync Audit Logs (Tracks product & filter insertions/updates)
SELECT id, menu_identifier, action, total_received, inserted_count, updated_count, status, message, created_at
FROM sync_logs
ORDER BY created_at DESC
LIMIT 10;
