import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const Get_Tren_BestS_NewAr_DesigSet_Album = async (
  storeData,
  mode,
  customerID,
  filterObj = {},
  currentPage = 1,
  itemsPerPage = 20,
) => {
  try {
    // Fetch data from session storage
    const storeInit = storeData ?? {};
    const userData =
      JSON.parse(sessionStorage.getItem("loginUserDetail")) ?? {};
    const userLogin = sessionStorage.getItem("LoginUser");
    const email = sessionStorage.getItem("registerEmail") ?? "";

    // Choose source based on userLogin status
    // const dataSource = userLogin ? userData : storeInit;
    const dataSource = userLogin ? userData : storeInit;

    const sharedParams = {
      FrontEnd_RegNo: storeInit?.FrontEnd_RegNo || "",
      Customerid: customerID || "",
      PackageId: dataSource?.PackageId || "",
      Laboursetid: dataSource?.pricemanagement_laboursetid || "",
      diamondpricelistname: dataSource?.diamondpricelistname || "",
      colorstonepricelistname: dataSource?.colorstonepricelistname || "",
      SettingPriceUniqueNo: dataSource?.SettingPriceUniqueNo || "",
      Metalid: dataSource?.MetalId || "",
      DiaQCid: dataSource?.cmboDiaQCid || "",
      CsQCid: dataSource?.cmboCSQCid || "",
      IsStockWebsite: storeInit?.IsStockWebsite || "",
      IsPLW: storeInit?.IsPLW || "",
      CurrencyRate: dataSource?.CurrencyRate || storeInit?.CurrencyRate || "",
      Collectionid: filterObj?.collection || "",
      Categoryid: filterObj?.category || "",
      SubCategoryid: filterObj?.subcategory || "",
      Brandid: filterObj?.brand || "",
      Genderid: filterObj?.gender || "",
      Ocassionid: filterObj?.ocassion || "",
      Themeid: filterObj?.theme || "",
      Producttypeid: filterObj?.producttype || "",
      FilPrice: filterObj?.Price || "",
      Min_DiaWeight: "",
      Max_DiaWeight: "",
      Min_GrossWeight: "",
      Max_GrossWeight: "",
      Min_NetWt: "",
      Max_NetWt: "",
      WebDiscount: userLogin ? `${userData?.WebDiscount ?? 0}` : `${0}`,
      IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
      IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
    };

    // Extend params for specific modes
    const extendedParams =
      mode === "GETDesignSet_List"
        ? {
            ...sharedParams,
            PageNo: `${currentPage}`,
            PageSize: `${itemsPerPage}`,
          }
        : sharedParams;

    const params = JSON.stringify(extendedParams);

    // Construct the request body
    const body = {
      con: `{\"id\":\"\",\"mode\":\"${mode}\",\"appuserid\":\"${email}\"}`,
      f: "zen (cartcount)",
      p: params,
    };

    // Call the CommonAPI and return the response
    const res = await CommonAPI(body);
    console.log("🚀 ~ Get_Tren_BestS_NewAr_DesigSet_Album ~ res:", res);
    return res;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
