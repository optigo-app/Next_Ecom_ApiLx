import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";


const ProductListApi = async (filterObj = {}, page, obj = {}, mainData = "", visiterId, sortby = "", diaRange = {}, netWt = {}, gross = {}, Shape = "", dno = "", album = "") => {

  let MenuParams = {};
  let serachVar = ""

  if (Array.isArray(mainData)) {
    if (mainData?.length > 0) {
      Object.values(mainData[0])?.forEach((ele, index) => {
        let keyName = `FilterKey${index === 0 ? '' : index}`;
        MenuParams[keyName] = ele.replace(/%20/g, ' ')
      })

      Object.values(mainData[1])?.forEach((ele, index) => {
        let keyName = `FilterVal${index === 0 ? '' : index}`;
        MenuParams[keyName] = ele.replace(/%20/g, ' ')
      })
    }
  } else {
    if (mainData !== "") {

      if (mainData?.split("=")[0] == "S") {
        serachVar = JSON.parse(atob(mainData?.split("=")[1]))
      } else {
        MenuParams.FilterKey = atob(mainData)
        MenuParams.FilterVal = atob(mainData)
      }

      if (mainData?.split("=")[0] !== "S") {
        if (atob(mainData)?.split("=")[0] == "AlbumName") {
          MenuParams.FilterKey = atob(mainData)?.split("=")[0]
          MenuParams.FilterVal = atob(mainData)?.split("=")[1]
        } else {
          MenuParams.FilterKey = atob(mainData)
          MenuParams.FilterVal = atob(mainData)
        }
      }
    }
  }

  let storeinit = getSession("storeInit");
  let loginInfo = getSession("loginUserDetail");

  const islogin = getSession("LoginUser") ?? false;

  const isGuest = storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

  const customerId = isGuest ? visiterId : (loginInfo?.id ?? 0);
  const customerEmail = isGuest ? visiterId : (loginInfo?.userid ?? "");

  let diaQc = (obj?.dia === undefined ? (loginInfo?.cmboDiaQCid ?? storeinit?.cmboDiaQCid) : obj?.dia)
  let csQc = (obj?.cs === undefined ? (loginInfo?.cmboCSQCid ?? storeinit?.cmboCSQCid) : obj?.cs)
  let mtid = (obj?.mt === undefined ? (loginInfo?.MetalId ?? storeinit?.MetalId) : obj?.mt)
  let filPrice = Array.isArray(filterObj?.Price) && filterObj.Price.length > 0
    ? filterObj.Price
    : '';

  const priceData = Array.isArray(filterObj)
    ? filterObj.find(item => item.dropdownIndex === 4) || {}
    : [];

  let foreveryPrice = priceData?.value
    ? { Minval: priceData.value[0], Maxval: priceData.value[1] }
    : {};

  const hasValidMin = filterObj.PriceMin !== null && filterObj.PriceMin !== undefined;
  const hasValidMax = filterObj.PriceMax !== null && filterObj.PriceMax !== undefined;

  const elveePrice = (hasValidMin || hasValidMax)
    ? {
      Minval: hasValidMin ? filterObj.PriceMin : filPrice[0]?.Minval,
      Maxval: hasValidMax ? filterObj.PriceMax : filPrice[0]?.Maxval
    }
    : {};

  const isNonEmptyObject = (obj) => obj && Object.keys(obj).length > 0;

  const data = {
    PackageId: loginInfo?.PackageId ?? storeinit?.PackageId ?? "",
    autocode: '',
    FrontEnd_RegNo: storeinit?.FrontEnd_RegNo ?? "",
    Customerid: customerId ?? 0,
    designno: dno ?? '',
    Shape: Shape ?? "",
    FilterKey: MenuParams?.FilterKey ?? "",
    FilterVal: MenuParams?.FilterVal ?? "",
    FilterKey1: MenuParams?.FilterKey1 ?? "",
    FilterVal1: MenuParams?.FilterVal1 ?? "",
    FilterKey2: MenuParams?.FilterKey2 ?? "",
    FilterVal2: MenuParams?.FilterVal2 ?? "",
    SearchKey: serachVar?.b ?? "",
    PageNo: page ?? "",
    PageSize: storeinit?.PageSize ?? "",
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
    Min_DiaWeight: diaRange?.DiaMin ?? "",
    Max_DiaWeight: diaRange?.DiaMax ?? "",
    Min_GrossWeight: gross?.grossMin ?? "",
    Max_GrossWeight: gross?.grossMax ?? "",
    Min_NetWt: netWt?.netMin ?? "",
    Max_NetWt: netWt?.netMax ?? "",
    FilPrice:
      isNonEmptyObject(foreveryPrice)
        ? foreveryPrice
        : isNonEmptyObject(elveePrice)
          ? elveePrice
          : filPrice ?? "",
    CurrencyRate: loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate ?? "",
    SortBy: sortby ?? "",
    Laboursetid: isGuest
      ? (storeinit?.pricemanagement_laboursetid ?? "")
      : (loginInfo?.pricemanagement_laboursetid ?? storeinit?.pricemanagement_laboursetid ?? ""),
    diamondpricelistname: isGuest
      ? (storeinit?.diamondpricelistname ?? "")
      : (loginInfo?.diamondpricelistname ?? storeinit?.diamondpricelistname ?? ""),
    colorstonepricelistname: isGuest
      ? (storeinit?.colorstonepricelistname ?? "")
      : (loginInfo?.colorstonepricelistname ?? storeinit?.colorstonepricelistname ?? ""),
    SettingPriceUniqueNo: isGuest
      ? (storeinit?.SettingPriceUniqueNo ?? "")
      : (loginInfo?.SettingPriceUniqueNo ?? storeinit?.SettingPriceUniqueNo ?? ""),
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

  let encData = JSON.stringify(data)

  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETPRODUCTLIST\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "onlogin (GETPRODUCTLIST)",
    p: encData,
    // p: btoa(encData),
    // dp: encData,
  };

  let pdList = [];
  let pdResp = [];

  await CommonAPI(body).then((res) => {
    if (res) {
      pdList = res?.Data.rd;
      pdResp = res?.Data
    }
  });

  return { pdList, pdResp }
};

export default ProductListApi;
