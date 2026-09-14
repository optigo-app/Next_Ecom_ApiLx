import { logger, logEmitter } from "@/db/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/logs/stream
 * Real-time plain text & SSE log streaming directly in the browser or terminal.
 * Open in browser: http://localhost:3000/api/logs/stream
 */
export async function GET(req) {
  const encoder = new TextEncoder();
  const { searchParams } = new URL(req.url);
  const isSse = searchParams.get("sse") === "true" || req.headers.get("accept")?.includes("text/event-stream");
  const filterDomain = (searchParams.get("domain") || "").toLowerCase();
  const filterLevel = (searchParams.get("level") || "").toUpperCase();

  const stream = new ReadableStream({
    start(controller) {
      const headerMsg = isSse
        ? `event: connected\ndata: ${JSON.stringify({ status: "connected", timestamp: new Date().toISOString() })}\n\n`
        : `=== REAL-TIME LOG STREAM STARTED [${new Date().toISOString()}] ===\n\n`;

      controller.enqueue(encoder.encode(headerMsg));

      // 1. Send recent log history
      try {
        const recentLogs = logger.getRecentLogs(50);
        for (const log of recentLogs) {
          if (filterDomain && !log.domain?.toLowerCase().includes(filterDomain)) continue;
          if (filterLevel && log.level !== filterLevel) continue;

          if (isSse) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
          } else {
            const metaStr = log.meta ? ` | data: ${JSON.stringify(log.meta)}` : "";
            const line = `[${log.timestamp}] [${log.level}] [${log.domain}] [${log.category}] ${log.message}${metaStr}\n`;
            controller.enqueue(encoder.encode(line));
          }
        }
      } catch (err) {
        console.error("Error sending initial log batch:", err);
      }

      // 2. Subscribe to live log emissions
      const onLog = (entry) => {
        try {
          if (filterDomain && !entry.domain?.toLowerCase().includes(filterDomain)) return;
          if (filterLevel && entry.level !== filterLevel) return;

          if (isSse) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(entry)}\n\n`));
          } else {
            const metaStr = entry.meta ? ` | data: ${JSON.stringify(entry.meta)}` : "";
            const line = `[${entry.timestamp}] [${entry.level}] [${entry.domain}] [${entry.category}] ${entry.message}${metaStr}\n`;
            controller.enqueue(encoder.encode(line));
          }
        } catch (streamErr) {
          // Stream closed
          logEmitter.off("log", onLog);
        }
      };

      logEmitter.on("log", onLog);

      // 3. Heartbeat ping every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          if (isSse) {
            controller.enqueue(encoder.encode(`: ping\n\n`));
          } else {
            // Invisible whitespace/comment keep-alive
            controller.enqueue(encoder.encode(``));
          }
        } catch (_) {
          clearInterval(pingInterval);
          logEmitter.off("log", onLog);
        }
      }, 15000);

      // 4. Cleanup on client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        logEmitter.off("log", onLog);
        try {
          controller.close();
        } catch (_) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": isSse ? "text/event-stream; charset=utf-8" : "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
