/**
 * Central login persistence setting.
 *
 * SESSION_BASED_LOGIN = true  -> login lasts only for the browser session. Auth cookies have no
 *                                "expires" (session cookies, shared by all tabs, removed when the
 *                                browser closes) and nothing is mirrored into localStorage.
 * SESSION_BASED_LOGIN = false -> persistent login: rolling cookies that expire after
 *                                LOGIN_EXPIRY_DAYS (renewed on every visit) + localStorage backup
 *                                that is only honoured while the login cookie is still valid.
 */
export const SESSION_BASED_LOGIN = false;
export const LOGIN_EXPIRY_DAYS = 3;

export const AUTH_COOKIE_OPTIONS = SESSION_BASED_LOGIN
  ? { path: "/" }
  : { path: "/", expires: LOGIN_EXPIRY_DAYS };

const PERSISTENT_AUTH_LOCAL_KEYS = [
  "loginUserDetail",
  "LoginUser",
  "token",
  "AuthToken",
  "pricing_table_name",
  "policy_table",
];

/** Removes auth values left in localStorage by the previous persistent-login mode. */
export function purgePersistentAuthStorage() {
  if (!SESSION_BASED_LOGIN || typeof window === "undefined") return;
  try {
    PERSISTENT_AUTH_LOCAL_KEYS.forEach((k) => window.localStorage.removeItem(k));
  } catch (_) {}
}
