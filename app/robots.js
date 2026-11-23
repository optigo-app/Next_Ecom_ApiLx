import { getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getSiteDetails } from "./(core)/seo";

export const dynamic = "force-dynamic";

export default async function robots() {
  let siteUrl = "https://beluxjewel.web";
  try {
    const storeInit = await getStoreInit();
    const details = await getSiteDetails(storeInit);
    if (details?.siteUrl) siteUrl = details.siteUrl;
  } catch { }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cartPage",
        "/account/",
        "/profile/",
        "/payment/",
        "/confirmation/",
        "/delivery/",
        "/forgotpass",
        "/LoginOption",
        "/ContinueWithEmail",
        "/ContinueWithMobile",
        "/LoginWithEmail",
        "/LoginWithEmailCode",
        "/LoginWithMobileCode",
        "/register",
        "/signin",
        "/logout",
        "/loginoption",
        "/continuewithemail",
        "/continuewithmobile",
        "/loginwithemail",
        "/loginwithemailcode",
        "/loginwithmobilecode",
        "/forgotpassword",
        "/forgetpassword",
        "/forgetpass",
        "/myWishList",
        "/menu",
        "/push",
        "/cache",
        "/clear-cache",
        "/tes",
        "/components/testcheckout"
      ],
    },
    sitemap: [`${siteUrl.replace(/\/+$/, "")}/api/sitemap`],
  };
}
