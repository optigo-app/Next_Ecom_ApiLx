import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import pc from "picocolors";

// Global EventEmitter instance for SSE log streaming
class LogStreamEmitter extends EventEmitter {}

const globalForLogs = globalThis;
if (!globalForLogs.__logEmitter) {
  globalForLogs.__logEmitter = new LogStreamEmitter();
  globalForLogs.__logEmitter.setMaxListeners(100);
}

export const logEmitter = globalForLogs.__logEmitter;

const LOG_DIR = path.join(process.cwd(), "log");
const MAIN_LOG_FILE = path.join(LOG_DIR, "app.log");
const ERROR_LOG_FILE = path.join(LOG_DIR, "error.log");

// Log retention configuration
const MAX_LOG_LINES = 2000;         // Max lines kept in active log file
const PRUNE_THRESHOLD_LINES = 2500; // Trigger prune when file exceeds this
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB max file size
const MAX_AGE_DAYS = 7;             // Retention period: 7 days

// File log coloring flag (can be toggled via env LOG_FILE_COLOR or logger.setColorizeFileLogs)
let colorizeFileLogs = process.env.LOG_FILE_COLOR === "true";

let writeCounter = 0;

// Ensure log directory exists
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (err) {
  console.error("Failed to initialize log directory:", err.message);
}

/**
 * Strips ANSI color escape sequences from a string
 */
function stripAnsi(str) {
  return typeof str === "string" ? str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "") : str;
}

/**
 * Formats console log lines with rich colors and badges using picocolors
 */
function formatConsole(entry) {
  const time = pc.gray(entry.timestamp.split("T")[1]?.replace("Z", "") || entry.timestamp);
  const domain = entry.domain === "SYSTEM" ? pc.dim(`[${entry.domain}]`) : pc.green(pc.bold(`[${entry.domain}]`));
  const category = pc.magenta(pc.bold(`[${entry.category}]`));

  let icon = pc.cyan("ℹ️");
  let badge = pc.cyan(pc.bold(`[${entry.level}]`));
  let msgColor = pc.white;

  if (entry.level === "WARN") {
    icon = pc.yellow("⚠️");
    badge = pc.yellow(pc.bold("[WARN]"));
    msgColor = pc.yellow;
  } else if (entry.level === "ERROR") {
    icon = pc.red("❌");
    badge = pc.red(pc.bold("[ERROR]"));
    msgColor = (s) => pc.red(pc.bold(s));
  } else if (entry.level === "DEBUG") {
    icon = pc.gray("🔍");
    badge = pc.gray(pc.bold("[DEBUG]"));
    msgColor = pc.gray;
  }

  let line = `${icon}  ${time} ${badge} ${domain} ${category} ${msgColor(entry.message)}`;

  if (entry.meta) {
    const { queryParams, headers, body, ...otherMeta } = entry.meta;
    const hasRequestParts = queryParams !== undefined || headers !== undefined || body !== undefined;

    if (hasRequestParts) {
      if (queryParams && Object.keys(queryParams).length > 0) {
        line += `\n  ${pc.yellow("Query:")} ${pc.dim(JSON.stringify(queryParams))}`;
      }
      if (headers && Object.keys(headers).length > 0) {
        line += `\n  ${pc.cyan("Headers:")} ${pc.dim(JSON.stringify(headers))}`;
      }
      if (body !== undefined && body !== null) {
        let bodyStr = typeof body === "string" ? body : JSON.stringify(body);
        if (bodyStr.length > 2000) {
          bodyStr = `${bodyStr.substring(0, 2000)}... [truncated ${bodyStr.length} chars in console, full in app.log]`;
        }
        line += `\n  ${pc.green("Body:")} ${pc.dim(bodyStr)}`;
      }
      if (Object.keys(otherMeta).length > 0) {
        line += `\n  ${pc.magenta("Meta:")} ${pc.dim(JSON.stringify(otherMeta))}`;
      }
    } else {
      line += pc.dim(` | data: ${JSON.stringify(entry.meta)}`);
    }
  }

  return line;
}

/**
 * Formats a log line for disk storage (plain text or optional ANSI color)
 */
function formatFileLine(entry, colorize = false) {
  const metaStr = entry.meta ? ` | data: ${JSON.stringify(entry.meta)}` : "";
  if (!colorize) {
    return `[${entry.timestamp}] [${entry.level}] [${entry.domain}] [${entry.category}] ${entry.message}${metaStr}\n`;
  }

  let levelBadge = pc.cyan(`[${entry.level}]`);
  if (entry.level === "WARN") levelBadge = pc.yellow(`[${entry.level}]`);
  if (entry.level === "ERROR") levelBadge = pc.red(`[${entry.level}]`);
  if (entry.level === "DEBUG") levelBadge = pc.gray(`[${entry.level}]`);

  return `${pc.gray(`[${entry.timestamp}]`)} ${levelBadge} ${pc.green(`[${entry.domain}]`)} ${pc.magenta(`[${entry.category}]`)} ${entry.message}${metaStr}\n`;
}

/**
 * Formats a log entry into a structured object & text line
 */
function createLogEntry(level, category, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const domain = meta?.domain || meta?.host || "SYSTEM";

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    level: level.toUpperCase(),
    category: category ? category.toUpperCase() : "GENERAL",
    domain,
    message: typeof message === "string" ? message : JSON.stringify(message),
    meta: meta && Object.keys(meta).length > 0 ? meta : undefined,
  };

  const formattedLine = formatFileLine(entry, colorizeFileLogs);

  return { entry, formattedLine };
}

/**
 * Prunes a single log file by line count, file size, and timestamp age
 */
function pruneFile(filePath, maxLines = MAX_LOG_LINES, maxAgeDays = MAX_AGE_DAYS, force = false) {
  try {
    if (!fs.existsSync(filePath)) return { pruned: 0, total: 0 };

    const stat = fs.statSync(filePath);
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split("\n").filter(Boolean);

    // If not forced and file is within limits, skip
    if (!force && lines.length <= PRUNE_THRESHOLD_LINES && stat.size <= MAX_FILE_SIZE_BYTES) {
      return { pruned: 0, total: lines.length };
    }

    const cutoffTime = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

    // Filter lines by timestamp age and slice to maxLines
    const freshLines = lines.filter((line) => {
      const cleanLine = stripAnsi(line);
      const match = cleanLine.match(/^\[(.*?)\]/);
      if (match && match[1]) {
        const lineTime = new Date(match[1]).getTime();
        if (!isNaN(lineTime) && lineTime < cutoffTime) {
          return false; // older than maxAgeDays
        }
      }
      return true;
    });

    const finalLines = freshLines.slice(-maxLines);
    const prunedCount = lines.length - finalLines.length;

    // Write back atomically
    fs.writeFileSync(filePath, finalLines.join("\n") + (finalLines.length > 0 ? "\n" : ""), "utf8");

    return { pruned: prunedCount, total: finalLines.length };
  } catch (err) {
    console.error(`[Logger] Failed to prune log file ${filePath}:`, err.message);
    return { pruned: 0, total: 0, error: err.message };
  }
}

/**
 * Appends log text to file safely and periodically prunes old logs
 */
function appendToFile(filePath, text) {
  try {
    fs.appendFile(filePath, text, "utf8", (err) => {
      if (err) {
        console.error(`[Logger] Failed to write to ${filePath}:`, err.message);
      }
    });

    // Run auto-pruning every 50 writes
    writeCounter++;
    if (writeCounter % 50 === 0) {
      setTimeout(() => {
        pruneFile(MAIN_LOG_FILE);
        pruneFile(ERROR_LOG_FILE);
      }, 0);
    }
  } catch (err) {
    console.error(`[Logger] Exception writing to ${filePath}:`, err.message);
  }
}

/**
 * Main logger utility
 */
export const logger = {
  /**
   * Configure whether logs written to app.log / error.log include ANSI color codes
   */
  setColorizeFileLogs(enable = true) {
    colorizeFileLogs = Boolean(enable);
    return colorizeFileLogs;
  },

  getColorizeFileLogs() {
    return colorizeFileLogs;
  },

  /**
   * Universal API request logger: captures method, pathname, query parameters,
   * every request header, and payload body.
   */
  logApiRequest(req, options = {}) {
    try {
      const url = req?.url ? new URL(req.url) : null;
      const pathname = url?.pathname || req?.nextUrl?.pathname || "";
      const method = (req?.method || options.method || "GET").toUpperCase();

      // Extract all query parameters
      const queryParams = {};
      if (url?.searchParams) {
        for (const [k, v] of url.searchParams.entries()) {
          queryParams[k] = v;
        }
      }

      // Extract all headers
      const headers = {};
      if (req?.headers) {
        if (typeof req.headers.entries === "function") {
          for (const [k, v] of req.headers.entries()) {
            headers[k] = v;
          }
        } else if (typeof req.headers.forEach === "function") {
          req.headers.forEach((v, k) => {
            headers[k] = v;
          });
        } else if (typeof req.headers === "object") {
          Object.assign(headers, req.headers);
        }
      }

      const domain =
        options.domain ||
        queryParams.domain ||
        queryParams.Domain ||
        queryParams.Websitedomain ||
        headers["x-domain"] ||
        headers["domain"] ||
        "SYSTEM";

      const defaultCategory = `API_${pathname.split("/").filter(Boolean).pop()?.toUpperCase().replace(/-/g, "_") || "SQLITE"}`;
      const category = options.category || defaultCategory;

      const body = options.body !== undefined ? options.body : (method === "GET" ? undefined : null);

      const meta = {
        domain,
        method,
        pathname,
        queryParams,
        headers,
        body,
        ...options.meta,
      };

      const message = options.message || `${method} ${pathname}`;
      return this.info(category, message, meta);
    } catch (err) {
      return this.error("LOGGER", `Failed to log API request: ${err.message}`, { error: err.stack });
    }
  },

  info(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("INFO", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.log(formatConsole(entry));
    return entry;
  },

  warn(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("WARN", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.warn(formatConsole(entry));
    return entry;
  },

  error(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("ERROR", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    appendToFile(ERROR_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.error(formatConsole(entry));
    return entry;
  },

  debug(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("DEBUG", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.debug(formatConsole(entry));
    return entry;
  },

  /**
   * Reads recent log lines from disk
   * @param {number} [limit=100]
   * @returns {Array<object>}
   */
  getRecentLogs(limit = 100) {
    try {
      if (!fs.existsSync(MAIN_LOG_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(MAIN_LOG_FILE, "utf8");
      const lines = raw.trim().split("\n").filter(Boolean);
      const recentLines = lines.slice(-limit);

      return recentLines.map((line) => {
        try {
          const cleanLine = stripAnsi(line);
          const match = cleanLine.match(/^\[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] (.*)$/);
          if (match) {
            const [, timestamp, level, domain, category, rest] = match;
            let message = rest;
            let meta = null;
            if (rest.includes(" | data: ")) {
              const [msgPart, dataPart] = rest.split(" | data: ");
              message = msgPart;
              try {
                meta = JSON.parse(dataPart);
              } catch (_) {}
            }
            return {
              id: `${timestamp}-${Math.random()}`,
              timestamp,
              level,
              domain,
              category,
              message,
              meta,
            };
          }
        } catch (_) {}
        return {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          level: "INFO",
          domain: "SYSTEM",
          category: "LOG",
          message: stripAnsi(line),
        };
      });
    } catch (err) {
      console.error("[Logger] Error reading recent logs:", err.message);
      return [];
    }
  },

  /**
   * Prunes old log entries explicitly
   * @param {object} [options]
   * @param {number} [options.keep=1000] - Number of most recent lines to keep
   * @param {number} [options.maxAgeDays=7] - Max age in days
   */
  pruneOldLogs(options = {}) {
    const keep = options.keep || MAX_LOG_LINES;
    const maxAgeDays = options.maxAgeDays || MAX_AGE_DAYS;

    const mainResult = pruneFile(MAIN_LOG_FILE, keep, maxAgeDays, true);
    const errorResult = pruneFile(ERROR_LOG_FILE, keep, maxAgeDays, true);

    const totalPruned = (mainResult.pruned || 0) + (errorResult.pruned || 0);

    logEmitter.emit("log", {
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: "INFO",
      domain: "SYSTEM",
      category: "LOGGER",
      message: `Pruned ${totalPruned} old log entries. Kept last ${keep} lines.`,
    });

    return {
      success: true,
      totalPruned,
      mainLogsRemaining: mainResult.total,
      errorLogsRemaining: errorResult.total,
    };
  },

  /**
   * Clears the log files completely
   */
  clearLogs() {
    try {
      if (fs.existsSync(MAIN_LOG_FILE)) fs.writeFileSync(MAIN_LOG_FILE, "", "utf8");
      if (fs.existsSync(ERROR_LOG_FILE)) fs.writeFileSync(ERROR_LOG_FILE, "", "utf8");
      logEmitter.emit("log", {
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: "INFO",
        domain: "SYSTEM",
        category: "LOGGER",
        message: "Log history cleared by administrator.",
      });
      return true;
    } catch (err) {
      console.error("[Logger] Failed to clear logs:", err.message);
      return false;
    }
  },
};

export default logger;
