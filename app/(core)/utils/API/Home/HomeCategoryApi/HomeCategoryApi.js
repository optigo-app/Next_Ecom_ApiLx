import { getSession } from "../../../FetchSessionData";
import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const HomeCategoryApi = async (visiterId) => {
    try {
        const storeInit = (typeof window !== 'undefined' && window.__STORE_INIT__) ? window.__STORE_INIT__ : getSession('storeInit');

        const loginUserDetail = getSession("loginUserDetail");
        const isLogin = getSession("LoginUser", false);
        const userLogin = getSession('LoginUser');

        const dataSource = userLogin ? loginUserDetail : storeInit;
        const domain = window.location.hostname;

        const customerId =
            storeInit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null)
                ? visiterId
                : loginUserDetail?.id ?? 0;

        const customerEmail =
            storeInit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null)
                ? visiterId
                : loginUserDetail?.userid ?? "";

        const data = {
            FrontEnd_RegNo: `${storeInit?.FrontEnd_RegNo}`,
            Customerid: `${customerId ?? 0}`,
            PackageId: `${dataSource?.PackageId ?? 1}`,
            domainname: domain

        };

        const encData = JSON.stringify(data);

        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETHomeCategory\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "GETHomeCategory",
            p: encData,
        };

        let response;
        await CommonAPI(body).then((res) => {
            if (res) response = res;
        });

        return response;
    } catch (error) {
        console.error("HomeCategoryApi Error:", error);
        throw error;
    }
};
