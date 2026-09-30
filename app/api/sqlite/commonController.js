import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { logger } from "@/db/logger";

/**
 * Extracts target domain from query parameters, headers, or body.
 * 
 * @param {Request} req
 * @param {object} [body={}]
 * @returns {string|null}
 */
export function extractDomain(req, body = {}) {
  // 1. Read from query param: ?domain=...
  try {
    const { searchParams } = new URL(req.url);
    const qDomain = searchParams.get("domain") || searchParams.get("Domain");
    if (qDomain && qDomain.trim()) return qDomain.trim();
  } catch (_) {}

  // 2. Read from headers
  try {
    const headerDomain = req.headers.get("x-domain") || req.headers.get("domain");
    if (headerDomain && headerDomain.trim()) return headerDomain.trim();
  } catch (_) {}

  // 3. Read from body
  if (body?.domain || body?.Domain) {
    return String(body.domain || body.Domain).trim();
  }

  if (Array.isArray(body) && (body[0]?.domain || body[0]?.Domain)) {
    return String(body[0].domain || body[0].Domain).trim();
  }

  const rd0 = body?.Data?.rd?.[0] || body?.rd?.[0];
  if (rd0?.domain) {
    return String(rd0.domain).trim();
  }

  return null;
}

/**
 * Creates a standardized POST handler for pushing any entity into SQLite.
 * 
 * @param {object} config
 * @param {string} config.entityName - e.g. "Menus", "StoreInit", "Filters"
 * @param {Function} config.saveFn - Procedure function (db, payload) => result
 * @param {string} [config.logCategory] - Category for logger (default: `API_${entityName.toUpperCase()}`)
 * @param {Function} [config.validateFn] - Optional validator (body) => boolean|string
 * @returns {Function} Next.js POST Route Handler
 */
export function createPushHandler({ entityName, saveFn, logCategory, validateFn }) {
  const category = logCategory || `API_${entityName.toUpperCase()}`;

  return async function POST(req) {
    try {
      let body;
      try {
        body = await req.json();
      } catch (parseErr) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid JSON in request body",
            details: parseErr.message,
          },
          { status: 400 }
        );
      }

      if (!body || (typeof body !== "object" && !Array.isArray(body))) {
        return NextResponse.json(
          { success: false, error: `Empty or invalid ${entityName} payload` },
          { status: 400 }
        );
      }

      if (typeof validateFn === "function") {
        const valError = validateFn(body);
        if (valError) {
          return NextResponse.json(
            { success: false, error: typeof valError === "string" ? valError : `Validation failed for ${entityName}` },
            { status: 400 }
          );
        }
      }

      const targetDomain = extractDomain(req, body);
      if (!targetDomain) {
        logger.warn(category, `POST /api/sqlite/${entityName.toLowerCase()} called without domain`);
        return NextResponse.json(
          {
            success: false,
            error: "Domain is required. Provide it via query param (?domain=xyz.com), header ('x-domain: xyz.com'), or body field ('domain': 'xyz.com').",
          },
          { status: 400 }
        );
      }

      logger.info(category, `POST /api/sqlite/${entityName.toLowerCase()}: Pushing ${entityName} for domain '${targetDomain}'`, { domain: targetDomain });

      const db = getTenantDb(targetDomain);
      const result = saveFn(db, body);

      logger.info(category, `Successfully persisted ${entityName} for '${targetDomain}' in ${result.elapsedMs || 0}ms`, {
        domain: targetDomain,
        counts: result.counts || result.count || result.savedCount,
        elapsedMs: result.elapsedMs,
      });

      return NextResponse.json(
        {
          success: true,
          message: `${entityName} data successfully pushed and saved into SQLite.`,
          domain: targetDomain,
          counts: result.counts || result.count || result.savedCount,
          totalReceived: result.totalReceived,
          elapsedMs: result.elapsedMs,
        },
        { status: 200 }
      );
    } catch (error) {
      logger.error(category, `POST /api/sqlite/${entityName.toLowerCase()} error: ${error.message}`, { error: error.stack });
      return NextResponse.json(
        {
          success: false,
          error: `Failed to push ${entityName} data into SQLite`,
          message: error.message,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a standardized GET handler for querying any entity from SQLite.
 * 
 * @param {object} config
 * @param {string} config.entityName - e.g. "Menus", "StoreInit", "Filters"
 * @param {Function} config.getFn - Procedure function (db, options) => response
 * @param {string} [config.logCategory] - Category for logger (default: `API_${entityName.toUpperCase()}`)
 * @param {Function} [config.parseParamsFn] - Function (searchParams) => options object
 * @returns {Function} Next.js GET Route Handler
 */
export function createGetHandler({ entityName, getFn, logCategory, parseParamsFn }) {
  const category = logCategory || `API_${entityName.toUpperCase()}`;

  return async function GET(req) {
    try {
      const targetDomain = extractDomain(req);

      if (!targetDomain) {
        logger.warn(category, `GET /api/sqlite/${entityName.toLowerCase()} called without domain`);
        return NextResponse.json(
          {
            Status: "400",
            Message: `Domain parameter is required to access ${entityName} data. Please pass ?domain=yourdomain.com or Header 'x-domain: yourdomain.com'.`,
            Data: { rd: [] },
          },
          { status: 400 }
        );
      }

      const { searchParams } = new URL(req.url);
      const options = typeof parseParamsFn === "function" ? parseParamsFn(searchParams) : {};
      options.domain = targetDomain;

      logger.info(category, `GET /api/sqlite/${entityName.toLowerCase()} reading for domain '${targetDomain}'`, { domain: targetDomain, options });

      const db = getTenantDb(targetDomain);
      const data = getFn(db, options);

      // Handle null / missing response
      if (!data || (data.Data && Array.isArray(data.Data.rd) && data.Data.rd.length === 0)) {
        logger.warn(category, `No ${entityName} data found in SQLite for domain '${targetDomain}'`, { domain: targetDomain });
        return NextResponse.json(
          {
            Status: "404",
            Message: `No ${entityName} data found for domain '${targetDomain}'.`,
            Data: { rd: [] },
          },
          { status: 404 }
        );
      }

      // If data is already in standard format { Status, Message, Data }, return directly
      if (data?.Status && data?.Data) {
        return NextResponse.json(data, { status: 200 });
      }

      // Otherwise wrap in standard response
      return NextResponse.json(
        {
          Status: "200",
          Message: "Request processed successfully.",
          Data: {
            rd: Array.isArray(data) ? data : [data],
          },
        },
        { status: 200 }
      );
    } catch (error) {
      logger.error(category, `GET /api/sqlite/${entityName.toLowerCase()} error: ${error.message}`, { error: error.stack });
      return NextResponse.json(
        {
          Status: "500",
          Message: error.message,
          Data: { rd: [] },
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a standardized DELETE handler for clearing or deleting entity records in SQLite.
 * 
 * @param {object} config
 * @param {string} config.entityName - e.g. "Products", "Menus", "StoreInit", "Filters"
 * @param {Function} config.deleteFn - Procedure function (db, options) => result
 * @param {string} [config.logCategory]
 * @returns {Function} Next.js DELETE Route Handler
 */
export function createDeleteHandler({ entityName, deleteFn, logCategory }) {
  const category = logCategory || `API_${entityName.toUpperCase()}`;

  return async function DELETE(req) {
    try {
      let body = {};
      try {
        body = await req.json();
      } catch (_) {}

      const targetDomain = extractDomain(req, body);
      if (!targetDomain) {
        return NextResponse.json(
          {
            success: false,
            error: "Domain is required. Provide it via query param (?domain=xyz.com), header ('x-domain: xyz.com'), or body field ('domain': 'xyz.com').",
          },
          { status: 400 }
        );
      }

      const { searchParams } = new URL(req.url);
      const queryOptions = {};
      for (const [k, v] of searchParams.entries()) {
        queryOptions[k] = v;
      }

      const options = { ...queryOptions, ...body, domain: targetDomain };

      logger.info(category, `DELETE /api/sqlite/${entityName.toLowerCase()}: Deleting records for domain '${targetDomain}'`, { domain: targetDomain, options });

      const db = getTenantDb(targetDomain);
      const result = typeof deleteFn === "function"
        ? deleteFn(db, options)
        : { success: true, message: "Deleted" };

      // Ensure WAL checkpoint
      try {
        db.pragma("wal_checkpoint(TRUNCATE)");
      } catch (_) {}

      logger.info(category, `Successfully deleted ${entityName} for '${targetDomain}'`, { domain: targetDomain, result });

      return NextResponse.json(
        {
          success: true,
          domain: targetDomain,
          ...result,
        },
        { status: 200 }
      );
    } catch (error) {
      logger.error(category, `DELETE /api/sqlite/${entityName.toLowerCase()} error: ${error.message}`, { error: error.stack });
      return NextResponse.json(
        {
          success: false,
          error: `Failed to delete ${entityName} data from SQLite`,
          message: error.message,
        },
        { status: 500 }
      );
    }
  };
}
