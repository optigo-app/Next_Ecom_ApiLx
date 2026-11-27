import { getTenantDb } from "@/db/tenantManager";
import { getMenus } from "@/db/procedures/getMenus";
import { activeBrand } from "@/app/env";
import { AppConfig } from "@/app/(core)/constants/AppConfig";
import { getCurrentTenantDomain } from "./productSitemap";

const themeRoutes = [
  { path: "/aboutUs", load: (t) => import(`@/app/theme/${t}/AboutUs/page.js`) },
  { path: "/career", load: (t) => import(`@/app/theme/${t}/career/page.js`) },
  { path: "/contactUs", load: (t) => import(`@/app/theme/${t}/contactUs/page.js`) },
  { path: "/faq", load: (t) => import(`@/app/theme/${t}/faq/page.js`) },
  { path: "/appointment", load: (t) => import(`@/app/theme/${t}/appointment/page.js`) },
  { path: "/asset-management", load: (t) => import(`@/app/theme/${t}/asset-management/page.js`) },
  { path: "/bespoke-jewelry", load: (t) => import(`@/app/theme/${t}/bespoke-jewelry/page.js`) },
  { path: "/blogs", load: (t) => import(`@/app/theme/${t}/Blogs/page.js`) },
  { path: "/customer-service", load: (t) => import(`@/app/theme/${t}/CustomerService/page.js`) },
  { path: "/customization", load: (t) => import(`@/app/theme/${t}/customization/page.js`) },
  { path: "/ourStory", load: (t) => import(`@/app/theme/${t}/ourStory/page.js`) },
  { path: "/privacyPolicy", load: (t) => import(`@/app/theme/${t}/privacyPolicy/page.js`) },
  { path: "/terms-and-conditions", load: (t) => import(`@/app/theme/${t}/TermsAndConditions/page.js`) },
  { path: "/why-quality-matters", load: (t) => import(`@/app/theme/${t}/quality/page.js`) },
];

const complianceRoutes = {
  "/privacy-policy": "privacy_policy",
  "/support": "support",
  "/copyright": "copyright",
  "/account-delete": "account_delete",
};

const entry = (url, changeFrequency, priority, lastModified = new Date().toISOString()) =>
  ({ url, lastModified, changeFrequency, priority });

async function themeHas(load, themePage) {
  try {
    await load(themePage);
    return true;
  } catch {
    return false;
  }
}

export async function getStaticSitemapEntries(siteUrl, themePage) {
  const entries = [
    entry(siteUrl, "daily", 1.0),
    entry(`${siteUrl}/collection`, "weekly", 0.8),
    entry(`${siteUrl}/Lookbook`, "weekly", 0.8),
    entry(`${siteUrl}/offers`, "weekly", 0.7),
  ];
  if (!themePage) return entries;

  const available = await Promise.all(themeRoutes.map(({ load }) => themeHas(load, themePage)));
  const pages = themeRoutes.filter((_, index) => available[index]).map(({ path }) => path);
  entries.push(...pages.map((path) => entry(`${siteUrl}${path}`, "monthly", 0.5)));

  if (await themeHas((t) => import(`@/app/theme/${t}/Blogs/BlogDetail.jsx`), themePage)) {
    const blogData = await import("@/app/theme/elvee.web/Blogs/BlogData").then((m) => m.default).catch(() => []);
    entries.push(...(blogData || []).filter((post) => post?.id != null)
      .map((post) => entry(`${siteUrl}/blogs/${encodeURIComponent(post.id)}`, "monthly", 0.5)));
  }

  const compliance = AppConfig[activeBrand]?.compliance_content || {};
  entries.push(...Object.entries(complianceRoutes)
    .filter(([, key]) => compliance[key])
    .map(([path]) => entry(`${siteUrl}${path}`, "yearly", 0.3)));

  return entries;
}

function buildListingPath(menuname, params) {
  const values = params.map(({ value }) => value).filter(Boolean);
  if (!values.length) return null;
  const keys = params.map(({ key }) => key).filter(Boolean);
  const encoded = Buffer.from(`${values.join(",")}/${keys.join(",")}`, "utf-8").toString("base64");
  const segments = [menuname, ...values].map((part) => encodeURIComponent(part)).join("/");
  return `/p/${segments}?M=${encodeURIComponent(encoded)}`;
}

export async function getListingSitemapEntries(siteUrl, packageId) {
  try {
    const db = getTenantDb(await getCurrentTenantDomain());
    if (!db) return [];
    const menus = getMenus(db, { raw: true, strictPackage: packageId != null, packageId });
    const paths = new Set();
    for (const menu of menus) {
      const menuname = String(menu?.menuname ?? "").trim();
      if (!menuname) continue;
      const params = [0, 1, 2].map((level) => ({
        key: String(menu[`param${level}name`] ?? "").trim(),
        value: String(menu[`param${level}dataname`] ?? "").trim(),
      }));
      for (let depth = 1; depth <= params.length; depth++) {
        if (!params[depth - 1].key) break;
        const path = buildListingPath(menuname, params.slice(0, depth));
        if (path) paths.add(path);
      }
    }
    return [...paths].map((path) => entry(`${siteUrl}${path}`, "daily", 0.8));
  } catch {
    return [];
  }
}
