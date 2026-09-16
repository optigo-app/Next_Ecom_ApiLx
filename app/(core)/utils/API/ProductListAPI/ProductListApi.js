import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import { syncProductsToSqlite } from "../../sqlite/sqliteSync";
import { getSqliteProducts } from "../../sqlite/sqliteActions";
import { getPricingPolicyParams } from "@/app/(core)/utils/product/pricingPolicy";

const ProductListApi = async (
  filterObj = {},
  page,
  obj = {},
  mainData = "",
  visiterId,
  sortby = "",
  diaRange = {},
  netWt = {},
  gross = {},
  Shape = "",
  dno = "",
  album = "",
) => {
  let MenuParams = {};
  let serachVar = {};

  if (Array.isArray(mainData) && mainData.length >= 2 && mainData[0] && mainData[1]) {
    const keys = Array.isArray(mainData[0]) ? mainData[0] : Object.values(mainData[0]);
    const vals = Array.isArray(mainData[1]) ? mainData[1] : Object.values(mainData[1]);
    keys.forEach((k, index) => {
      if (k) {
        const keyName = `FilterKey${index === 0 ? "" : index}`;
        const valName = `FilterVal${index === 0 ? "" : index}`;
        MenuParams[keyName] = String(k).trim().replace(/%20/g, " ");
        MenuParams[valName] = String(vals[index] ?? "").trim().replace(/%20/g, " ");
      }
    });
  } else if (mainData !== "" && typeof mainData === "string") {
    if (mainData.split("=")[0] === "S") {
      try {
        serachVar = JSON.parse(atob(decodeURIComponent(mainData.split("=")[1])));
      } catch (_) {}
    } else {
      try {
        if (atob(decodeURIComponent(mainData)).split("=")[0] === "AlbumName") {
          MenuParams.FilterKey = atob(decodeURIComponent(mainData)).split("=")[0];
          MenuParams.FilterVal = atob(decodeURIComponent(mainData)).split("=")[1];
        } else {
          MenuParams.FilterKey = atob(decodeURIComponent(mainData));
          MenuParams.FilterVal = atob(decodeURIComponent(mainData));
        }
      } catch (_) {}
    }
  } else {
    const savedMenu = getSession("menuparams");
    if (savedMenu && savedMenu.FilterKey !== undefined) {
      MenuParams.FilterKey = savedMenu.FilterKey ?? "";
      MenuParams.FilterVal = savedMenu.FilterVal ?? "";
      MenuParams.FilterKey1 = savedMenu.FilterKey1 ?? "";
      MenuParams.FilterVal1 = savedMenu.FilterVal1 ?? "";
      MenuParams.FilterKey2 = savedMenu.FilterKey2 ?? "";
      MenuParams.FilterVal2 = savedMenu.FilterVal2 ?? "";
    }
  }

  let storeinit = getSession("storeInit");
  let loginInfo = getSession("loginUserDetail");

  const islogin = getSession("LoginUser") ?? false;

  const isGuest =
    storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

  const customerId = isGuest ? visiterId : (loginInfo?.id ?? 0);
  const customerEmail = isGuest ? visiterId : (loginInfo?.userid ?? "");

  let diaQc =
    obj?.dia === undefined
      ? (loginInfo?.cmboDiaQCid ?? storeinit?.cmboDiaQCid)
      : obj?.dia;
  let csQc =
    obj?.cs === undefined
      ? (loginInfo?.cmboCSQCid ?? storeinit?.cmboCSQCid)
      : obj?.cs;
  let mtid =
    obj?.mt === undefined
      ? (loginInfo?.MetalId ?? storeinit?.MetalId)
      : obj?.mt;
  let filPrice =
    Array.isArray(filterObj?.Price) && filterObj.Price.length > 0
      ? filterObj.Price
      : "";

  const priceData = Array.isArray(filterObj)
    ? filterObj.find((item) => item.dropdownIndex === 4) || {}
    : [];

  let foreveryPrice = priceData?.value
    ? { Minval: Number(priceData.value[0]) || 0, Maxval: Number(priceData.value[1]) || 0 }
    : {};

  const hasValidMin =
    filterObj?.PriceMin !== null &&
    filterObj?.PriceMin !== undefined &&
    filterObj?.PriceMin !== "" &&
    !isNaN(Number(filterObj?.PriceMin));
  const hasValidMax =
    filterObj?.PriceMax !== null &&
    filterObj?.PriceMax !== undefined &&
    filterObj?.PriceMax !== "" &&
    !isNaN(Number(filterObj?.PriceMax));

  const elveePrice =
    hasValidMin || hasValidMax
      ? {
          Minval: hasValidMin ? Number(filterObj.PriceMin) : (filPrice[0]?.Minval ?? 0),
          Maxval: hasValidMax ? Number(filterObj.PriceMax) : (filPrice[0]?.Maxval ?? 0),
        }
      : {};

  const isNonEmptyObject = (o) => o && typeof o === "object" && Object.keys(o).length > 0 && (o.Minval !== undefined || o.Maxval !== undefined);

  const data = {
    PackageId: loginInfo?.PackageId ?? storeinit?.PackageId ?? "",
    autocode: "",
    FrontEnd_RegNo: storeinit?.FrontEnd_RegNo ?? "",
    Customerid: customerId ?? 0,
    designno: dno ?? "",
    Shape: Shape ?? "",
    FilterKey: MenuParams?.FilterKey ?? "",
    FilterVal: MenuParams?.FilterVal ?? "",
    FilterKey1: MenuParams?.FilterKey1 ?? "",
    FilterVal1: MenuParams?.FilterVal1 ?? "",
    FilterKey2: MenuParams?.FilterKey2 ?? "",
    FilterVal2: MenuParams?.FilterVal2 ?? "",
    SearchKey: serachVar?.b ?? "",
    PageNo: page ?? 1,
    PageSize: 1000000 ?? storeinit?.PageSize ?? "",
    Metalid: mtid ?? "",
    DiaQCid: diaQc ?? "",
    CsQCid: csQc ?? "0,0",
    Collectionid: filterObj?.collection ?? "",
    Categoryid: filterObj?.category ?? "",
    SubCategoryid: filterObj?.subcategory ?? "",
    Brandid: filterObj?.brand ?? "",
    Genderid: filterObj?.gender ?? "",
    Ocassionid: filterObj?.ocassion ?? "",
    Themeid: filterObj?.theme ?? "",
    Producttypeid: filterObj?.producttype ?? "",
    MetalColorid: filterObj?.metalcolor ?? filterObj?.MetalColorid ?? "",
    Min_DiaWeight: diaRange?.DiaMin ?? "",
    Max_DiaWeight: diaRange?.DiaMax ?? "",
    Min_GrossWeight: gross?.grossMin ?? "",
    Max_GrossWeight: gross?.grossMax ?? "",
    Min_NetWt: netWt?.netMin ?? "",
    Max_NetWt: netWt?.netMax ?? "",
    FilPrice: isNonEmptyObject(foreveryPrice)
      ? [foreveryPrice]
      : isNonEmptyObject(elveePrice)
        ? [elveePrice]
        : (Array.isArray(filPrice) ? filPrice : filPrice ? [filPrice] : []),
    CurrencyRate: loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate ?? "",
    SortBy: sortby ?? "",
    ...getPricingPolicyParams({
      storeinit,
      loginUserDetail: loginInfo,
      islogin,
    }),
    IsStockWebsite: storeinit?.IsStockWebsite ?? "",
    Size: "",
    IsFromDesDet: "",
    IsPLW: storeinit?.IsPLW ?? "",
    DomainForNo: storeinit?.DomainForNo ?? "",
    AlbumName: album ?? "",
    TaxId: loginInfo?.TaxId || 0,
    WebDiscount: islogin ? (loginInfo?.WebDiscount ?? 0) : 0,
    IsZeroPriceProductShow: storeinit?.IsZeroPriceProductShow ?? 0,
    IsSolitaireWebsite: storeinit?.IsSolitaireWebsite ?? 0,
  };

  // 1. Ultra-fast SQLite query first (< 5ms)
  try {
    const targetDomain = storeinit?.domain;
    const sqliteRes = await getSqliteProducts(data, {}, targetDomain);
    if (sqliteRes?.success) {
      return {
        pdList: sqliteRes.pdList,
        pdResp: sqliteRes.pdResp,
      };
    }
  } catch (sqlErr) {
    console.warn("[ProductListApi] SQLite lookup skipped:", sqlErr?.message);
  }

  // 2. Fallback to network API if SQLite does not have the products yet
  let encData = JSON.stringify(data);
  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETPRODUCTFULLLIST\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "onlogin (GETPRODUCTLIST)",
    p: encData
  };

  let pdList = [];
  let pdResp = [];

  await CommonAPI(body).then((res) => {
    if (res) {
      pdList = res?.Data?.rd || [];
      pdResp = res?.Data || {};
    }
  });

  // Background sync to SQLite without blocking UI
  if (Array.isArray(pdList) && pdList.length > 0) {
    const menuIdent = (typeof window !== "undefined" && window.location?.pathname) || MenuParams?.FilterVal || "default";
    syncProductsToSqlite(menuIdent, pdList, storeinit?.domain);
  }
  return { pdList, pdResp };
};

export default ProductListApi;
