import { logger } from "@/db/logger";

/**
 * Node.js-only Instrumentation initialization
 */
export async function initNodeInstrumentation() {
  process.on("uncaughtException", (err) => {
    logger.error("NODE_UNCAUGHT_EXCEPTION", err?.message || "Uncaught process exception", {
      stack: err?.stack,
    });
  });

  process.on("unhandledRejection", (reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    logger.error("NODE_UNHANDLED_REJECTION", message, {
      stack,
    });
  });
}

/**
 * Node.js-only Request Error handling
 */
export async function handleRequestError(err, request, context) {
  try {
    const method = request?.method || "GET";
    const path = request?.path || "";
    const headersObj = {};

    if (request?.headers?.entries) {
      for (const [k, v] of request.headers.entries()) {
        headersObj[k] = v;
      }
    }

    const host = headersObj["host"] || headersObj["x-forwarded-host"] || "SYSTEM";
    const domain = String(host).split(":")[0];

    logger.error("SERVER_REQUEST_ERROR", err?.message || "Server request failure", {
      domain,
      url: path,
      method,
      stack: err?.stack,
      digest: err?.digest,
      routerKind: context?.routerKind,
      routePath: context?.routePath,
      routeType: context?.routeType,
    });
  } catch (loggingErr) {
    console.error("[instrumentation-node.handleRequestError] Logging failed:", loggingErr);
  }
}
