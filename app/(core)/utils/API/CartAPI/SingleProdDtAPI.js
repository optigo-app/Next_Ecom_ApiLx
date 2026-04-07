import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const fetchSingleProdDT = async (selectedItem, sizedata, diaId, csQid, selectedMetalId, visiterId) => {
    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
    const islogin = getSession("LoginUser") ?? false;
    const data = getSession("loginUserDetail");

    const isGuest = storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null);

    const customerId = isGuest ? visiterId : (data?.id ?? 0);
    const customerEmail = isGuest ? visiterId : (data?.userid ?? "");
    const { FrontEnd_RegNo } = storeInit;

    let packageId = isGuest ? storeInit?.PackageId : (data?.PackageId ?? storeInit?.PackageId ?? 0);
    let laboursetid = isGuest ? (storeInit?.pricemanagement_laboursetid ?? "") : (data?.pricemanagement_laboursetid ?? storeInit?.pricemanagement_laboursetid ?? "");
    let diamondpricelistname = isGuest ? (storeInit?.diamondpricelistname ?? "") : (data?.diamondpricelistname ?? storeInit?.diamondpricelistname ?? "");
    let colorstonepricelistname = isGuest ? (storeInit?.colorstonepricelistname ?? "") : (data?.colorstonepricelistname ?? storeInit?.colorstonepricelistname ?? "");
    let SettingPriceUniqueNo = isGuest ? (storeInit?.SettingPriceUniqueNo ?? "") : (data?.SettingPriceUniqueNo ?? storeInit?.SettingPriceUniqueNo ?? "");

    let mtID = selectedMetalId !== undefined && selectedMetalId !== null ? selectedMetalId : selectedItem?.metaltypeid;
    let diaID = diaId !== undefined && diaId !== null ? diaId : `${selectedItem?.diamondqualityid},${selectedItem?.diamondcolorid}`;
    let csQID = csQid !== undefined && csQid !== null ? csQid : `${selectedItem?.colorstonequalityid},${selectedItem?.colorstonecolorid}`;
    let size = sizedata !== undefined && sizedata !== null ? sizedata : "";

    try {
        const combinedValue = JSON.stringify({
            PageNo: "1",
            PageSize: "1000",
            CurrRate: "1",
            autocode: selectedItem?.autocode ?? "",
            designno: selectedItem?.designno ?? "",
            FrontEnd_RegNo: FrontEnd_RegNo ?? "",
            Customerid: customerId ?? 0,
            PackageId: packageId ?? "",
            Laboursetid: laboursetid,
            diamondpricelistname: diamondpricelistname,
            colorstonepricelistname: colorstonepricelistname,
            SettingPriceUniqueNo: SettingPriceUniqueNo,
            Metalid: mtID ?? "",
            DiaQCid: diaID ?? "",
            CsQCid: csQID ?? "",
            Size: size ?? "",
            IsFromDesDet: "1",
            CurrencyRate: data?.CurrencyRate ?? storeInit?.CurrencyRate ?? "",
            DomainForNo: storeInit?.DomainForNo ?? "",
            WebDiscount: islogin ? (data?.WebDiscount ?? 0) : 0,
            IsZeroPriceProductShow: storeInit?.IsZeroPriceProductShow ?? 0,
            IsSolitaireWebsite: storeInit?.IsSolitaireWebsite ?? 0,
        });

        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETPRODUCTLIST\",\"appuserid\":\"${customerEmail}\"}`,
            f: "Header (getCartData)",
            // p: btoa(combinedValue),
            // dp: combinedValue
            "p": combinedValue
        };

        const response = await CommonAPI(body);
        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
