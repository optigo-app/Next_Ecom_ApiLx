import fs from "fs";
import path from "path";
import { EventEmitter } from "events";

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

  const metaStr = entry.meta ? ` | data: ${JSON.stringify(entry.meta)}` : "";
  const formattedLine = `[${entry.timestamp}] [${entry.level}] [${entry.domain}] [${entry.category}] ${entry.message}${metaStr}\n`;

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
      const match = line.match(/^\[(.*?)\]/);
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
  info(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("INFO", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.log(`ℹ️ [${entry.category}] [${entry.domain}] ${entry.message}`);
    return entry;
  },

  warn(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("WARN", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.warn(`⚠️ [${entry.category}] [${entry.domain}] ${entry.message}`);
    return entry;
  },

  error(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("ERROR", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    appendToFile(ERROR_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.error(`❌ [${entry.category}] [${entry.domain}] ${entry.message}`);
    return entry;
  },

  debug(category, message, meta = {}) {
    const { entry, formattedLine } = createLogEntry("DEBUG", category, message, meta);
    appendToFile(MAIN_LOG_FILE, formattedLine);
    logEmitter.emit("log", entry);
    console.debug(`🔍 [${entry.category}] [${entry.domain}] ${entry.message}`);
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
          const match = line.match(/^\[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] (.*)$/);
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
          message: line,
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
