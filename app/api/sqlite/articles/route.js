import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { batchInsertArticles } from "@/db/procedures/batchInsertArticles";
import { batchInsertArticleMaterials } from "@/db/procedures/batchInsertArticleMaterials";
import { getArticlesByDesign } from "@/db/procedures/getArticlesByDesign";
import { getProductArticle } from "@/db/procedures/getProductArticle";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "../commonController";
import { syncDynamicPolicyArticles } from "@/app/(core)/utils/sqlite/syncDynamicArticles";
import {
  resolveArticleTableName,
  resolveArticleMaterialTableName,
  ensureDynamicArticleTable,
  ensureDynamicArticleMaterialTable,
} from "@/db/schema/dynamicArticles";
import { syncTableViaTemp } from "@/db/procedures/tempTableSync";

/**
 * Detects whether an object represents a policy pricing configuration rather than an article.
 * @param {object} item
 * @returns {boolean}
 */
function isPolicyConfig(item) {
  if (!item || typeof item !== "object") return false;
  const hasPolicyField =
    item.Laboursetid != null ||
    item.laboursetid != null ||
    item.pricemanagement_laboursetid != null ||
    item.diamondpricelistName != null ||
    item.diamondpricelistname != null ||
    item.Diamondpricelistname != null ||
    item.colorstonepricelistName != null ||
    item.colorstonepricelistname != null ||
    item.SettingPriceUniqueNo != null ||
    item.settingpriceuniqueno != null;

  const hasArticleField =
    item.ArticleNo != null ||
    item.articleno != null ||
    item.ArticleId != null ||
    item.MetalWeight != null ||
    item.MetalTypeId != null ||
    item.NetWeight != null;

  return Boolean(hasPolicyField && !hasArticleField);
}

/**
 * Extracts policy configuration array if the payload is a policy sync request.
 * Supports direct array [ { Laboursetid: 20, ... } ], [ { domain: "...", Config: [...] } ], { Config: [...] }, { policies: [...] }, etc.
 * @param {any} body
 * @returns {Array<object>|null}
 */
function extractPolicyConfigList(body) {
  if (!body) return null;
  if (body.mode) return null;

  // Case 1: Array containing wrapper object(s) with .Config or .config
  // e.g. [ { domain: "beluxjewel.web", Config: [ ... ] } ]
  if (Array.isArray(body) && body.length > 0 && (body[0]?.Config || body[0]?.config)) {
    const allConfigs = [];
    for (const b of body) {
      const list = b.Config || b.config;
      if (Array.isArray(list)) allConfigs.push(...list);
      else if (list) allConfigs.push(list);
    }
    return allConfigs;
  }

  // Case 2: Object with Config or config array
  // e.g. { domain: "beluxjewel.web", Config: [ ... ] }
  if (body.Config || body.config) {
    const arr = body.Config || body.config;
    return Array.isArray(arr) ? arr : [arr];
  }

  // Case 3: Object with policies or policy array
  if (body.policies || body.policy) {
    const arr = body.policies || body.policy;
    return Array.isArray(arr) ? arr : [arr];
  }

  // Case 4: Direct array of policy configuration objects
  // e.g. [ { Laboursetid: 1, diamondpricelistName: "dhruv", ... } ]
  if (Array.isArray(body) && body.length > 0 && isPolicyConfig(body[0])) {
    return body;
  }

  // Case 5: Single policy configuration object
  if (typeof body === "object" && !Array.isArray(body) && isPolicyConfig(body)) {
    return [body];
  }

  return null;
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const { searchParams } = new URL(req.url);
    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    // 1. Dynamic Policy-Based ERP Sync mode (when Config array or list of policies is provided)
    const policyConfigs = extractPolicyConfigList(body);
    if (policyConfigs && policyConfigs.length > 0) {
      const syncResult = await syncDynamicPolicyArticles({
        domain: targetDomain,
        Config: policyConfigs,
        batchSize: body?.batchSize || searchParams.get("batchSize") ? Number(body?.batchSize || searchParams.get("batchSize")) : undefined,
        force: body?.force === true || searchParams.get("force") === "true",
      });

      const isConflict = syncResult.inProgress && !syncResult.success;
      return NextResponse.json(
        {
          Status: syncResult.success ? "200" : (isConflict ? "409" : "400"),
          Message:
            syncResult.error ||
            `Processed ${syncResult.syncedTables?.length || 0} dynamic policy article table configurations.`,
          Data: {
            rd: syncResult.syncedTables || [],
          },
        },
        { status: syncResult.success ? 200 : (isConflict ? 409 : 400) }
      );
    }

    const shouldTruncate =
      searchParams.get("truncate") === "true" ||
      searchParams.get("clear") === "true" ||
      searchParams.get("flush") === "true" ||
      body?.truncate === true ||
      body?.clearBeforeSync === true ||
      body?.flush === true;

    const db = getTenantDb(targetDomain);
    const targetTable = resolveArticleTableName(db, {
      ...body,
      tableName: body?.tableName || searchParams.get("tableName") || body?.table || searchParams.get("table"),
    });

    // 2. Batch Insertion / PUSH mode with direct articles and/or materials
    const rawArticles = Array.isArray(body)
      ? (isPolicyConfig(body[0]) ? null : body)
      : body.articles || body.Data?.rd || body.rd || body.data;

    const rawMaterials = body?.materials || body?.Data?.rd1 || body?.rd1;

    if (Array.isArray(rawArticles) || Array.isArray(rawMaterials)) {
      let articleResult = { totalReceived: 0, insertedCount: 0, updatedCount: 0, deletedCount: 0, totalInDatabase: 0 };
      let materialResult = { totalReceived: 0, insertedCount: 0, updatedCount: 0, deletedCount: 0, totalInDatabase: 0 };

      if (Array.isArray(rawArticles) && rawArticles.length > 0) {
        articleResult = syncTableViaTemp(db, {
          mainTable: targetTable,
          keyCols: ["ArticleNo"],
          deleteStale: true,
          ensureMainTable: (d, t) => ensureDynamicArticleTable(d, t),
          stage: (tmp) => batchInsertArticles(db, rawArticles, { tableName: tmp }, tmp),
        });
      }

      if (Array.isArray(rawMaterials) && rawMaterials.length > 0) {
        const matTable = resolveArticleMaterialTableName(db, body, targetTable);
        materialResult = syncTableViaTemp(db, {
          mainTable: matTable,
          keyCols: ["id"],
          deleteStale: true,
          ensureMainTable: (d, t) => ensureDynamicArticleMaterialTable(d, t),
          stage: (tmp) => batchInsertArticleMaterials(db, rawMaterials, { tableName: tmp }, tmp),
        });
      }

      return NextResponse.json({
        Status: "200",
        Message: `Processed ${articleResult.totalReceived} articles and ${materialResult.totalReceived} materials for table ${targetTable}.`,
        Data: {
          rd: [
            {
              table: targetTable,
              totalReceived: articleResult.totalReceived,
              insertedCount: articleResult.insertedCount,
              updatedCount: articleResult.updatedCount,
              deletedCount: articleResult.deletedCount || 0,
              totalInDatabase: articleResult.totalInDatabase,
              materialsReceived: materialResult.totalReceived,
              materialsInserted: materialResult.insertedCount,
              materialsDeleted: materialResult.deletedCount || 0,
              totalMaterialsInDatabase: materialResult.totalInDatabase,
            },
          ],
        },
      });
    }

    // 3. Query mode via POST
    if (body?.mode === "GETPRODUCTARTICLE" || searchParams.get("mode") === "GETPRODUCTARTICLE") {
      const detailResult = getProductArticle(db, { ...body, tableName: targetTable });
      return NextResponse.json(detailResult, {
        status: 200,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    const result = getArticlesByDesign(db, { ...body, tableName: targetTable });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ SQLite Articles POST error:", error);
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [], rd1: [] },
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    let targetDomain = searchParams.get("domain") || searchParams.get("Domain");
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const filters = {};
    for (const [k, v] of searchParams.entries()) {
      filters[k] = v;
    }

    const db = getTenantDb(targetDomain);

    if (searchParams.get("mode") === "GETPRODUCTARTICLE") {
      const detailResult = getProductArticle(db, filters);
      return NextResponse.json(detailResult, {
        status: 200,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    }

    const result = getArticlesByDesign(db, filters);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ SQLite Articles GET error:", error);
    return NextResponse.json(
      {
        Status: "500",
        Message: error.message,
        Data: { rd: [], rd1: [] },
      },
      { status: 500 }
    );
  }
}
