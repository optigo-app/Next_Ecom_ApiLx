import { NEXT_APP_WEB } from "./env.js";

const clean = (host) => {
  try {
    return String(host ?? "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .replace(/:\d+$/, "");
  } catch (_) {
    return "";
  }
};

const INVALID = new Set(["", "default", "localhost", "127.0.0.1", "undefined", "null"]);

export const toDomainName = (host) => {
  const short = typeof host === "string" ? clean(host) : "";
  return INVALID.has(short) ? clean(NEXT_APP_WEB) : short;
};
