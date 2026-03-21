import { REACT_APP_WEB } from "../../../../env";
import { getSession } from "../../../FetchSessionData";
import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const HomeCollectionPageApi = async (visiterId = "") => {
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');

        const loginUserDetail = getSession("loginUserDetail");
        const isLogin = getSession("LoginUser", false);
        const userLogin = getSession('LoginUser');

        const dataSource = userLogin ? loginUserDetail : storeInit;

        const customerId = storeInit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null) ? visiterId : loginUserDetail?.id ?? 0;

        const customerEmail = storeInit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null) ? visiterId : loginUserDetail?.userid ?? "";

        const selectedTab = getSession("selectedTabPersistence") ?? "";
        const domain = window.location.hostname;
        const shouldPassMenuFilter = REACT_APP_WEB === "elvee.web";
        const data = {
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
            Customerid: `${customerId ?? 0}`,
            PackageId: `${dataSource?.PackageId}`,
            ...(shouldPassMenuFilter && {
                MenuFilterKey: "product_type",
                MenuFilterVal: selectedTab,
            }),
            domainname: domain
        };

        const encData = JSON.stringify(data);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETCollectionPage\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "GETCollectionPage",
            p: encData
        };
        let response;
        await CommonAPI(body).then((res) => {
            if (res) response = res;
        });

        return response;
    } catch (error) {
        console.error("HomeCollectionApi Error:", error);
        throw error;
    }
};
