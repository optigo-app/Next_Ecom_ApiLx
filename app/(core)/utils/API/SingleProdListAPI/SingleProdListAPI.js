import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const SingleProdListAPI = async (singprod, size = "", obj = {}, visiterId, AlbumName = '') => {


  let storeinit = getSession('storeInit');
  let loginInfo = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");

  const customerId = (storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginInfo?.id ?? 0);
  const customerEmail = (storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginInfo?.userid ?? "");

  // const data = {
  //     PackageId: `${loginInfo?.PackageId ?? storeinit?.PackageId }`,
  //     autocode: `${singprod?.a}`,
  //     FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
  //     Customerid: `${loginInfo?.id ?? 0}`,
  //     designno: `${singprod?.b}`,
  //     IsFromDesDet:1
  //   };

  console.log(
    "s obj = {} visiterId AlbumName",
    obj?.mt === null,
    `${obj?.mt == null ? (loginInfo?.MetalId ?? storeinit?.MetalId) : obj?.mt}`,
  )

  const data = {
    PackageId: `${loginInfo?.PackageId ?? storeinit?.PackageId}`,
    autocode: `${singprod?.a ?? ""}`,
    FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
    Customerid: `${customerId ?? 0}`,
    designno: `${singprod?.b}`,
    // FilterKey:`${MenuParams?.FilterKey ?? ""}`,
    // FilterVal:`${MenuParams?.FilterVal ?? ""}`,
    // FilterKey1:`${MenuParams?.FilterKey1 ?? ""}`,
    // FilterVal1:`${MenuParams?.FilterVal1 ?? ""}`,
    // FilterKey2:`${MenuParams?.FilterKey2 ?? ""}`,
    // FilterVal2:`${MenuParams?.FilterVal2 ?? ""}`,
    // SearchKey:`${serachVar ?? ""}`,
    // PageNo:`${page}`,
    // PageSize:`${storeinit?.PageSize}`,
    CurrencyRate: `${loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate}`,
    Metalid: `${obj?.mt == null ? (loginInfo?.MetalId ?? storeinit?.MetalId) : obj?.mt}`,
    DiaQCid: `${obj?.diaQc == null ? (loginInfo?.cmboDiaQCid ?? storeinit?.cmboDiaQCid) : obj?.diaQc}`,
    CsQCid: `${obj?.csQc == null ? (loginInfo?.cmboCSQCid ?? storeinit?.cmboCSQCid) : obj?.csQc ?? "0,0"}`,
    // Collectionid: `${filterObj?.collection ?? ""}`,
    // Categoryid: `${filterObj?.category ?? ""}`,
    // SubCategoryid: `${filterObj?.subcategory ?? ""}`,
    // Brandid: `${filterObj?.brand ?? ""}`,
    // Genderid: `${filterObj?.gender ?? ""}`,
    // Ocassionid: `${filterObj?.ocassion ?? ""}`,
    // Themeid: `${filterObj?.theme ?? ""}`,
    // Producttypeid: `${filterObj?.producttype ?? ""}`,
    // Min_DiaWeight: '',
    // Max_DiaWeight: '',
    // Min_GrossWeight: '',
    // Max_GrossWeight: '',
    // Max_NetWt: '',
    // Min_NetWt: '',
    // Max_Price: '',
    // Min_Price: '',
    // SortBy: "",
    Laboursetid: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.pricemanagement_laboursetid ?? ""
      : loginInfo?.pricemanagement_laboursetid ?? storeinit?.pricemanagement_laboursetid ?? ""
      }`,
    diamondpricelistname: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.diamondpricelistname ?? ""
      : loginInfo?.diamondpricelistname ?? storeinit?.diamondpricelistname ?? ""
      }`,
    colorstonepricelistname: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.colorstonepricelistname ?? ""
      : loginInfo?.colorstonepricelistname ?? storeinit?.colorstonepricelistname ?? ""
      }`,
    SettingPriceUniqueNo: `${storeinit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)
      ? storeinit?.SettingPriceUniqueNo ?? ""
      : loginInfo?.SettingPriceUniqueNo ?? storeinit?.SettingPriceUniqueNo ?? ""
      }`,
    IsStockWebsite: `${storeinit?.IsStockWebsite}`,
    Size: `${size}`,
    IsFromDesDet: 1,
    AlbumName: AlbumName ?? '',
    DomainForNo: `${storeinit?.DomainForNo ?? ""}`,
    WebDiscount: islogin ? `${loginInfo?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeinit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeinit?.IsSolitaireWebsite ?? 0}`,
  };

  let encData = JSON.stringify(data)

  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETPRODUCTLIST\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "(singleProdList)",
    // p: btoa(encData),
    // dp: encData,
    p: encData,
  };

  let pdList = [];
  let pdResp = [];
  let status = [];

  await CommonAPI(body).then((res) => {
    if (res) {
      // let pdData = res?.Data.rd;
      pdList = res?.Data.rd;
      pdResp = res?.Data;
      status = res;
    }
  });

  return { pdList, pdResp, status }
}