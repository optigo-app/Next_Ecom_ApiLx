/**
 * Pure helper function to normalize raw grouped website content
 * into clean, typed, sorted slices for both Server and Client environments.
 * 
 * NOTE: Does NOT invent fake fallbacks. If data is absent or empty, returns
 * clean empty arrays or null so components can handle actual empty/error states.
 */

export const sortContentByOrder = (list) => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => (Number(a?.sortOrder ?? 0)) - (Number(b?.sortOrder ?? 0)));
};

export function normalizeWebContent(rawGroupedData = {}) {
  const data = rawGroupedData || {};

  // Category Configuration & Sorted List
  const categoryConfigItem = data?.categoryconfig?.[0] || null;
  const categoryConfig = categoryConfigItem?.ContentJson || null;
  const categories = sortContentByOrder(categoryConfig?.categories);

  // Collection Configuration & Sorted List
  const collectionConfigItem = data?.collectionconfig?.[0] || null;
  const collectionConfig = collectionConfigItem?.ContentJson || null;
  const collections = sortContentByOrder(collectionConfig?.collections);

  // Branding Configuration (logos, brandName, tagline, etc.)
  const brandingItem = data?.branding?.[0] || null;
  const branding = brandingItem?.ContentJson || null;

  // SEO Configuration (meta, og, twitter, keywords, etc.)
  const seoItem = data?.seo?.[0] || null;
  const seo = seoItem?.ContentJson || null;

  // Banner Configuration & Grouped Banners
  const bannerGroup = data?.banner || {
    config: null,
    banners: [],
    byType: {},
  };
  const banners = Array.isArray(bannerGroup?.banners) ? bannerGroup.banners : [];
  const bannersByType = bannerGroup?.byType || {};
  const bannerConfig = bannerGroup?.config || null;

  // Helper to safely get banners by TypeKey
  const getBannersByType = (typeKey) => {
    if (!typeKey) return banners;
    return bannersByType[typeKey] || [];
  };

  // Theme Settings
  const themeSettingItem = data?.themesetting?.[0] || null;
  const themeSetting = themeSettingItem?.ContentJson || null;

  // Page Templates
  const pageTemplates = Array.isArray(data?.pagetemplate) ? data.pagetemplate : [];

  return {
    raw: data,
    categoryConfig,
    categories,
    collectionConfig,
    collections,
    branding,
    seo,
    banners,
    bannersByType,
    bannerConfig,
    getBannersByType,
    themeSetting,
    pageTemplates,
  };
}
