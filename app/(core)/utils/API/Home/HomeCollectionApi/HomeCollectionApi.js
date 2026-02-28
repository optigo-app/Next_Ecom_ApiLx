import { getSession } from "../../../FetchSessionData";
import { CommonAPI } from "../../CommonAPI/CommonAPI";

export const HomeCollectionApi = async (storeinit, visiterId = "") => {
    try {

        const loginUserDetail = getSession("loginUserDetail");
        const isLogin = getSession("LoginUser", false);
        const userLogin = getSession('LoginUser');

        const dataSource = userLogin ? loginUserDetail : storeinit;

        const customerId = storeinit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null) ? visiterId : loginUserDetail?.id ?? 0;

        const customerEmail = storeinit?.IsB2BWebsite == 0 && (isLogin == false || isLogin == null) ? visiterId : loginUserDetail?.userid ?? "";

        const domain = window.location.hostname;
        const data = {
            FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo}`,
            Customerid: `${customerId ?? 0}`,
            PackageId: `${dataSource?.PackageId}`,
            domainname: domain
        };

        const encData = JSON.stringify(data);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETHomeCollection\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "GETHomeCollection",
            p: encData,
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
