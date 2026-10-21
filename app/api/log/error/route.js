import { NextResponse } from "next/server";
import { logger } from "@/db/logger";
import { extractDomain } from "../../commonController";

export const dynamic = "force-dynamic";

/**
 * POST /api/log/error
 * Receives client-side errors and React boundary crashes,
 * appending detailed diagnostic records directly into log/error.log and log/app.log.
 */
export async function POST(req) {
  try {
    let body = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json") || contentType.includes("text/plain")) {
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch (_) {
        body = { message: text };
      }
    } else {
      body = await req.json().catch(() => ({}));
    }

    const targetDomain = extractDomain(req, body) || body?.domain || "SYSTEM";
    const category = body?.category || "CLIENT_ERROR";
    const message = body?.message || "Unknown client error";

    const meta = {
      domain: targetDomain,
      url: body?.url || req.headers.get("referer") || "",
      userAgent: body?.userAgent || req.headers.get("user-agent") || "",
      componentStack: body?.componentStack || undefined,
      stack: body?.stack || undefined,
      timestamp: body?.timestamp || new Date().toISOString(),
      ...(body?.meta || {}),
    };

    // Log directly to server logs (writes to both app.log and error.log)
    logger.error(category, message, meta);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    logger.error("ERROR_LOG_API_FAILURE", `Failed to record client error: ${err.message}`, {
      stack: err.stack,
    });
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
