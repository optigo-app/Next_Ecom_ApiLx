const REGISTRATION_PREFILL_PENDING = "registrationPrefillPending";

  /** Read and consume registration-only values so old login emails cannot refill a later visit. */
  export function consumeAuthRegistrationPrefill(searchParams = {}) {
    if (typeof window === "undefined") {
      return { email: "", mobile: "", countryCode: "" };
    }

    const queryValue = Array.isArray(searchParams?.email)
      ? searchParams.email[0]
      : searchParams?.email;
    let queryEmail = "";
    if (queryValue) {
      try {
        queryEmail = decodeURIComponent(String(queryValue));
      } catch {
        queryEmail = String(queryValue);
      }
    }

    const hasPendingPrefill =
      sessionStorage.getItem(REGISTRATION_PREFILL_PENDING) === "1";
    const email = queryEmail || (hasPendingPrefill
      ? sessionStorage.getItem("registerEmail") || sessionStorage.getItem("email") || ""
      : "");
    const mobile = hasPendingPrefill
      ? sessionStorage.getItem("registerMobile") || ""
      : "";
    const countryCode = hasPendingPrefill
      ? sessionStorage.getItem("Countrycodestate") || ""
      : "";

    sessionStorage.removeItem(REGISTRATION_PREFILL_PENDING);
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("Countrycodestate");
    sessionStorage.removeItem("email");

    return { email, mobile, countryCode };
  }

export function markAuthRegistrationPrefill() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(REGISTRATION_PREFILL_PENDING, "1");
  }
}
