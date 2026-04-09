import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const fetchEstimateTax = async () => {
    try {
        const islogin = getSession("LoginUser");
        const storedData = getSession('loginUserDetail');
        const storeInit = getSession('storeInit');
        const { FrontEnd_RegNo } = storeInit;
        const estimatedTaxId = storedData?.TaxId ?? 0

        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData?.id}`, TaxId: `${estimatedTaxId}`,
            WebDiscount: islogin ? `${storedData?.WebDiscount ?? 0}` : `${0}`,
            IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
            IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"GetTax\",\"appuserid\":\"${storedData?.userid}\"}`,
            "f": "GetTax (Order Summary)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        console.log(response, "response")
        if (response.Data.rd) {
            return response.Data.rd;
        } else {
            // toast.error('Something went wrong');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};