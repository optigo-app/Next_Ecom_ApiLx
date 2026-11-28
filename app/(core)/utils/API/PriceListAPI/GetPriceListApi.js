import { findCsQcId, findDiaQcId, findMetal } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getPricingPolicyParams } from "@/app/(core)/utils/product/pricingPolicy";

export const GetPriceListApi = async (page = 1, obj = {}, filterObj = {}, autocodeList, obje, mainData = "") => {
  const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
  const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));
  const param = JSON.parse(sessionStorage.getItem("menuparams"));
  const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
  const UserEmail = sessionStorage.getItem("registerEmail");

  let MenuParams = {};
  let serachVar = ""

  if (Array.isArray(mainData)) {
    if (mainData?.length > 0) {
      Object.values(mainData[0]).forEach((ele, index) => {
        let keyName = `FilterKey${index === 0 ? '' : index}`;
        MenuParams[keyName] = ele.replace(/%20/g, ' ')
      })

      Object.values(mainData[1]).forEach((ele, index) => {
        let keyName = `FilterVal${index === 0 ? '' : index}`;
        MenuParams[keyName] = ele.replace(/%20/g, ' ')
      })
    }
  } else {
    if (mainData !== "") {

      if (atob(mainData)?.split("=")[0] == "AlbumName") {
        MenuParams.FilterKey = atob(mainData)?.split("=")[0]
        MenuParams.FilterVal = atob(mainData)?.split("=")[1]
      }
      else if (mainData.split("=")[0] == "S") {
        serachVar = atob(mainData.split("=")[1])
      }
      else {
        MenuParams.FilterKey = atob(mainData)
        MenuParams.FilterVal = atob(mainData)
      }
    }
  }


  // let encodedFilter = {
  //     "DesignNo":"",
  //     "FilterKey":`${param?.FilterKey}`,
  //     "FilterVal":`${param?.FilterVal}`,
  //     "FilterKey1":`${param?.FilterKey1}`,
  //     "FilterVal1":`${param?.FilterVal1}`,
  //     "FilterKey2":`${param?.FilterKey2}`,
  //     "FilterVal2":`${param?.FilterVal2}`,
  //     "PageNo":`${page}`,
  //     "PageSize":`${storeInit?.PageSize}`,
  //     "Metalid":`${mtid}`,
  //     "DiaQCid":`${diaqcId}`,
  //     "CsQCid":`${csqcId}`,
  //     "IsFromDesDet":"0",
  //     "Collectionid": `${filterObj?.Collectionid ?? ""}`,
  //     "Categoryid": `${filterObj?.Categoryid ?? ""}`,
  //     "SubCategoryid": `${filterObj?.SubCategoryid ?? ""}`,
  //     "Brandid": `${filterObj?.Brandid ?? ""}`,
  //     "Genderid": `${filterObj?.Genderid ?? ""}`,
  //     "Ocassionid": `${filterObj?.Ocassionid ?? ""}`,
  //     "Themeid": `${filterObj?.Themeid ?? ""}`,
  //     "Min_DiaWeight": '',
  //     "Max_DiaWeight": '',
  //     "Min_GrossWeight": '',
  //     "Max_GrossWeight": '',
  //     "Max_NetWt": '',
  //     "Min_NetWt": '',
  //     "Max_Price": '',
  //     "Min_Price": '',
  //     "Producttypeid": `${filterObj?.Producttypeid ?? ""}`,
  //     "AutoCodeList":`${autocodeList}`,
  //   }

  // let diaQc = findDiaQcId(obje?.dia ?? loginUserDetail?.cmboDiaQCid)[0]
  // let csQc = findCsQcId(obje?.cs ?? loginUserDetail?.cmboCSQCid)[0]
  // let mtidd = obje?.mt===undefined ?loginUserDetail?.cmboMetalType: obje?.mt


  // let diaQc = (obje?.dia === undefined ?  loginUserDetail?.cmboDiaQCid : obj?.dia)
  // let csQc = (obje?.cs === undefined ? loginUserDetail?.cmboCSQCid : obj?.cs)
  // let mtid = findMetal(loginUserDetail?.cmboMetalType)[0]?.Metalid

  let diaQc = (obj?.dia === undefined ? loginUserDetail?.cmboDiaQCid : obj?.dia)
  let csQc = (obj?.cs === undefined ? loginUserDetail?.cmboCSQCid : obj?.cs)
  let mtid = (obj?.mt === undefined ? loginUserDetail?.MetalId : obj?.mt)

  // console.log("diaa prod api",obje?.mt);

  const GetPriceReq = {
    CurrencyRate: `${storeInit?.CurrencyRate}`,
    FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
    // "Customerid": `${loginUserDetail?.id}`,
    // "Laboursetid": `${loginUserDetail?.pricemanagement_laboursetid}`,
    // "diamondpricelistname": `${loginUserDetail?.diamondpricelistname}`,
    // "colorstonepricelistname": `${loginUserDetail?.colorstonepricelistname}`,
    // "SettingPriceUniqueNo": `${loginUserDetail?.SettingPriceUniqueNo}`,
    Customerid: `${loginUserDetail?.id ?? 0}`,
    ...getPricingPolicyParams({
      storeinit: storeInit,
      loginUserDetail,
      islogin,
    }),
    designno: "",
    FilterKey: `${MenuParams?.FilterKey ?? ""}`,
    FilterVal: `${MenuParams?.FilterVal ?? ""}`,
    FilterKey1: `${MenuParams?.FilterKey1 ?? ""}`,
    FilterVal1: `${MenuParams?.FilterVal1 ?? ""}`,
    FilterKey2: `${MenuParams?.FilterKey2 ?? ""}`,
    FilterVal2: `${MenuParams?.FilterVal2 ?? ""}`,
    SearchKey: `${serachVar ?? ""}`,
    PageNo: `${page}`,
    PageSize: `${storeInit?.PageSize}`,
    Metalid: `${obje?.mt ?? mtid}`,
    DiaQCid: `${diaQc}`,
    CsQCid: `${csQc}`,
    IsFromDesDet: "0",
    Collectionid: `${filterObj?.collection ?? ""}`,
    Categoryid: `${filterObj?.category ?? ""}`,
    SubCategoryid: `${filterObj?.subcategory ?? ""}`,
    Brandid: `${filterObj?.brand ?? ""}`,
    Genderid: `${filterObj?.gender ?? ""}`,
    Ocassionid: `${filterObj?.ocassion ?? ""}`,
    Themeid: `${filterObj?.theme ?? ""}`,
    Min_DiaWeight: "",
    Max_DiaWeight: "",
    Min_GrossWeight: "",
    Max_GrossWeight: "",
    Max_NetWt: "",
    Min_NetWt: "",
    Max_Price: "",
    Min_Price: "",
    Producttypeid: `${filterObj?.producttype ?? ""}`,
    AutoCodeList: `${autocodeList}`,
  };

  const encodedCombinedValue = btoa(JSON.stringify(GetPriceReq));

  let body = {
    con: `{\"id\":\"Store\",\"mode\":\"getdesignpricelist\",\"appuserid\":\"${UserEmail}\"}`,
    f: "onloadFirstTime (getdesignpricelist)",
    // p: encodedCombinedValue,
    // dp: JSON.stringify(GetPriceReq),
    p: JSON.stringify(GetPriceReq)
  };

  let PriceApiData;

  await CommonAPI(body).then((res) => {
    PriceApiData = res?.Data;
  });

  return PriceApiData;
};
