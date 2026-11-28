import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getPricingPolicyParams } from "@/app/(core)/utils/product/pricingPolicy";

export const handlePaymentAPI = async (visiterId, islogin, mode) => {
    const domainname = wesbiteDomainName;
    try {
        const selectedAddressId = sessionStorage.getItem('selectedAddressId');
        let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
        const storedData = sessionStorage.getItem("loginUserDetail");
        const selctedid = JSON.parse(selectedAddressId);
        const data = JSON.parse(storedData);
        const currencyId = data?.CurrencyCodeid
        const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data.id ?? 0;
        const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.userid ?? "";

        const { FrontEnd_RegNo } = storeInit;

        let packageId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.PackageId : data?.PackageId ?? 0

        let estimatedTaxId = data?.TaxId

        const combinedValue = JSON.stringify({
            addrid: `${selctedid.id}`,
            PaymentMethod: mode ?? 'Cash on Delivery',
            Istempaddress: '',
            addrType: 'select',
            OrderPlacedFrom: "1",
            CurrencyId: `${currencyId}`,
            orderRemarks: '',
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerId}`,
            packageId: packageId,
            ...getPricingPolicyParams({
                storeinit: storeInit,
                loginUserDetail: data,
                islogin,
            }),
            domain: storeInit?.domain ?? "",
            IsPLW: storeInit?.IsPLW,
            CurrencyRate: `${data?.CurrencyRate ?? storeInit?.CurrencyRate}`,
            TaxId: `${estimatedTaxId}`,
            domainname: domainname
        });

        console.log('combinedValuecombinedValue...', combinedValue);

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"Store\",\"mode\":\"PlaceOrder\",\"appuserid\":\"${customerEmail}\"}`,
            "f": "m-test2.orail.co.in (PlaceOrder)",
            // "p": encodedCombinedValue,
            // "dp": combinedValue
            "p": combinedValue
        };

        const response = await CommonAPI(body);

        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}