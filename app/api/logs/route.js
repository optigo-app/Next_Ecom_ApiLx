import { NextResponse } from "next/server";
import { logger } from "@/db/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/logs
 * View logs in plain text or JSON directly in browser/curl.
 * Query parameters:
 *  - ?limit=100 (default 100)
 *  - ?format=json (default text)
 *  - ?level=ERROR|WARN|INFO|DEBUG
 *  - ?domain=yourdomain.web
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const level = (searchParams.get("level") || "").toUpperCase();
    const domain = (searchParams.get("domain") || "").toLowerCase();
    const format = (searchParams.get("format") || "text").toLowerCase();

    let logs = logger.getRecentLogs(limit);

    if (level) {
      logs = logs.filter((l) => l.level === level);
    }
    if (domain) {
      logs = logs.filter((l) => l.domain?.toLowerCase().includes(domain));
    }

    if (format === "json") {
      return NextResponse.json({
        success: true,
        total: logs.length,
        logs,
      });
    }

    // Default: Return human-readable plain text
    const textOutput = logs
      .map((l) => {
        const metaStr = l.meta ? ` | data: ${JSON.stringify(l.meta)}` : "";
        return `[${l.timestamp}] [${l.level}] [${l.domain}] [${l.category}] ${l.message}${metaStr}`;
      })
      .join("\n");

    return new Response(
      `=== LOGS (Showing last ${logs.length} entries) ===\n\n` + (textOutput || "No logs matching query."),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-store",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/logs
 * Prune or clear log files.
 * Query parameters:
 *  - ?keep=50 (keep only the last 50 lines and delete older ones)
 *  - ?maxAgeDays=7 (delete entries older than 7 days)
 *  - ?all=true (wipe files completely)
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const keep = searchParams.get("keep") ? parseInt(searchParams.get("keep"), 10) : null;
    const maxAgeDays = searchParams.get("maxAgeDays") ? parseInt(searchParams.get("maxAgeDays"), 10) : 7;

    if (all) {
      const success = logger.clearLogs();
      return NextResponse.json({ success, message: "All logs cleared completely." });
    }

    if (keep !== null || searchParams.has("maxAgeDays")) {
      const result = logger.pruneOldLogs({ keep: keep || 1000, maxAgeDays });
      return NextResponse.json({
        success: true,
        message: `Pruned old logs. Kept last ${keep || 1000} lines.`,
        ...result,
      });
    }

    // Default: Clear all
    const success = logger.clearLogs();
    return NextResponse.json({ success, message: "Logs cleared successfully." });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
