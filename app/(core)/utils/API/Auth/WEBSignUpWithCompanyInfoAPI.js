import { CommonAPI } from "../CommonAPI/CommonAPI";
import { getSession } from "../../FetchSessionData";
import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";

export const WEBSignUpWithCompanyInfoAPI = async (companyInfo) => {
  try {
    const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');
    const { FrontEnd_RegNo } = storeInit || {};
    const domainname = (typeof wesbiteDomainName === 'function' ? wesbiteDomainName() : wesbiteDomainName) || (typeof window !== 'undefined' ? window.location.host : '');

    const formData = new FormData();

    formData.append("con", '{"id":"","mode":"WEBSignUpWithCompanyInfo"}');
    formData.append("mode", "WEBSignUpWithCompanyInfo");
    formData.append("f", "WEBSignUpWithCompanyInfo");

    const Document = [
      Object.fromEntries(
        Object.values(companyInfo?.documents || {}).map((doc) => [doc.type, doc.number || ""])
      )
    ];

    const payload = {
      CompanyName: companyInfo?.company_name || "",
      TypeOfEntityId: companyInfo?.entity_type || "",
      CompnayTypeId: companyInfo?.industry_category || "",
      GSTNo: companyInfo?.gst_number || "",
      PanNo: companyInfo?.pan_number || "",
      IECCode: companyInfo?.iec_code || "",
      AddressLine1: companyInfo?.address_line || "",
      city: companyInfo?.city || "",
      state: companyInfo?.state || "",
      country: companyInfo?.country || "",
      zip: companyInfo?.pincode || "",
      firstname: companyInfo?.first_name || "",
      lastname: companyInfo?.last_name || "",
      userid: companyInfo?.email || "",
      country_code: companyInfo?.mobileCountry || "",
      mobileno: companyInfo?.mobileNo || "",
      pass: companyInfo?.password || "",
      FrontEnd_RegNo: FrontEnd_RegNo || "",
      Customerid: "0",
      domainname: domainname
    };

    formData.append("p", JSON.stringify(payload));

    Object.entries(companyInfo?.documents || {})?.forEach(([key, value]) => {
      formData.append(value?.type, value?.file);
    });

    const ParsedPayload = JSON.stringify(payload);
    const body = {
      "con": "{\"id\":\"\",\"mode\":\"WEBSignUpWithCompanyInfo\"}",
      "f": "WEBSignUpWithCompanyInfo",
      "p": ParsedPayload
    };

    const res = await CommonAPI(body);
    return res?.Data?.rd?.[0];
  } catch (error) {
    console.error("RegisterErr", error);
    return null;
  }
};
