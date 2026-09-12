
const normalizeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());

const normalizePriceListName = (v) => normalizeStr(v).toLowerCase();

const normalizeALC = (value) => {
  if (value === null || value === undefined || value === "" || value === 0 || value === "0") {
    return "";
  }
  return value;
};

const buildAlbumCacheKey = (type, storeData, pricing, id, custom) => {
  const meta = {
    type,
    PackageId: pricing?.PackageId ?? "",
    Laboursetid: pricing?.Laboursetid ?? "",
    // Laboursetid:0,
    diamondpricelistname: normalizePriceListName(pricing?.diamondpricelistname ?? ""),
    colorstonepricelistname: normalizePriceListName(pricing?.colorstonepricelistname ?? ""),
    SettingPriceUniqueNo: pricing?.SettingPriceUniqueNo ?? "",
    ACL: normalizeALC(custom),
  };

  const key = [type, normalizeStr(pricing?.PackageId), normalizeStr(pricing?.Laboursetid), normalizePriceListName(pricing?.diamondpricelistname), normalizePriceListName(pricing?.colorstonepricelistname), normalizeALC(custom)].join("_");

  return {
    key,
    meta,
  };
};

// Find matching cache entry from server response based on pricing context
const findMatchingCacheEntry = (serverEntries, pricingContext, eventName, alcValue) => {
  if (!serverEntries || !Array.isArray(serverEntries)) return null;

  const normalizedALC = normalizeALC(alcValue);
  const normalizedDiamond = normalizePriceListName(pricingContext?.diamondpricelistname);
  const normalizedColor = normalizePriceListName(pricingContext?.colorstonepricelistname);

  return serverEntries.find((entry) => {
    const entryALC = normalizeALC(entry.ALC);
    const entryDiamond = normalizePriceListName(entry.diamondpricelistname);
    const entryColor = normalizePriceListName(entry.colorstonepricelistname);
    return entry.EventName === eventName && entry.PackageId == pricingContext?.PackageId && entry.LabourSetId == pricingContext?.Laboursetid && entryDiamond === normalizedDiamond && entryColor === normalizedColor && entryALC === normalizedALC;
  });
};

const getPricingContext = (loginUserDetail, storeinit, islogin) => {
  if (!storeinit) return null;
  const loginInfo = loginUserDetail;
  return {
    PackageId: loginInfo?.PackageId ?? storeinit?.PackageId ?? "",
    Laboursetid: !islogin ? storeinit?.pricemanagement_laboursetid : loginInfo?.pricemanagement_laboursetid ?? "",
    diamondpricelistname: !islogin ? storeinit?.diamondpricelistname : loginInfo?.diamondpricelistname ?? "",
    colorstonepricelistname: !islogin ? storeinit?.colorstonepricelistname : loginInfo?.colorstonepricelistname ?? "",
    SettingPriceUniqueNo: !islogin ? storeinit?.SettingPriceUniqueNo : loginInfo?.SettingPriceUniqueNo ?? "",
  };
};

const processAlbumImages = (albums, storeInit) => {
  const fallbackImages = {};
  for (const data of albums) {
    const fullImageUrl = `${storeInit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;

    if (![storeInit?.AlbumImageFol, data?.AlbumImageFol, data?.AlbumImageName].every(Boolean) && data?.AlbumDetail) {
      const albumDetails = data.AlbumDetail ? JSON.parse(data.AlbumDetail) : [];
      if (albumDetails?.length > 0) {
        const fallbackImage = `${storeInit?.CDNDesignImageFol}${albumDetails?.[0]?.Image_Name}`;
        fallbackImages[fullImageUrl] = fallbackImage;
      }
    }
  }
  return fallbackImages;
};

export { normalizeStr, normalizePriceListName, normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext, processAlbumImages };