"use client";

/** Shared redirect/query handling for authentication screens. */
export function useAuthRedirects(searchParams = {}) {
  const search =
    searchParams?.LoginRedirect ||
    searchParams?.loginRedirect ||
    searchParams?.search ||
    "";
  const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";
  const cleanRedirect = search
    ? search.replace(/^\?LoginRedirect=/, "")
    : "";
  const queryParamStr = `${cleanRedirect ? `?LoginRedirect=${encodeURIComponent(cleanRedirect)}` : ""}${securityKey ? `${cleanRedirect ? "&" : "?"}SK=${encodeURIComponent(securityKey)}` : ""}`;
  const returnUrl = cleanRedirect
    ? cleanRedirect.startsWith("/")
      ? cleanRedirect
      : decodeURIComponent(cleanRedirect)
    : "/";

  const withAuthQuery = (path, extraParams = {}) => {
    const query = new URLSearchParams();
    if (cleanRedirect) query.set("LoginRedirect", cleanRedirect);
    if (securityKey) query.set("SK", securityKey);
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value != null && value !== "") query.set(key, String(value));
    });
    const queryString = query.toString();
    return `${path}${queryString ? `?${queryString}` : ""}`;
  };

  return {
    search,
    securityKey,
    cleanRedirect,
    queryParamStr,
    returnUrl,
    cancelUrl: `/LoginOption${queryParamStr}`,
    withAuthQuery,
  };
}
