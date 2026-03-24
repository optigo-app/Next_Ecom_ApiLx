import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";

export const RemoveCartAndWishAPI = async (type, autocode, visiterId, isFromStock = false, stockno) => {

  const UserEmail = getSession("registerEmail");
  const storeInit = getSession('storeInit');
  const loginUserDetail = getSession("loginUserDetail");
  const islogin = getSession("LoginUser");

  const customerId = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginUserDetail?.id ?? 0);
  const customerEmail = (storeInit?.IsB2BWebsite == 0 && (islogin == false || islogin == null)) ? visiterId : (loginUserDetail?.userid ?? "");

  let removeApiObj = {
    "ForEvt": `${type}`,
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
    "Customerid": `${customerId ?? 0}`,
    "autocode": `${autocode}`,
    // "StockId":`${}`,
    "Cartidlist": "",
    "isdelete_all": 0,
    "stockno": `${stockno ?? ""}`,
    "DomainForNo": `${storeInit?.DomainForNo ?? ""}`
  }
  let removeApiObj1 = {
    "ForEvt": `${type}`,
    "FrontEnd_RegNo": `${storeInit?.FrontEnd_RegNo}`,
    "Customerid": `${customerId ?? 0}`,
    // "autocode": `${autocode}`,
    "StockId": `${autocode}`,
    "Cartidlist": "",
    "isdelete_all": 0,
    "stockno": `${stockno ?? ""}`,
    "DomainForNo": `${storeInit?.DomainForNo ?? ""}`
  }

  let DataObj = isFromStock == true ? removeApiObj1 : removeApiObj

  let body = {
    con: `{\"id\":\"Store\",\"mode\":\"removeFromCartList\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: " (removeFromCartList)",
    // p: btoa(DataObj),
    // dp: JSON.stringify(DataObj),
    p: JSON.stringify(DataObj),

  };

  let cartAndWishResp;
  await CommonAPI(body).then((res) => {
    cartAndWishResp = res;
  });

  return cartAndWishResp;
};

// {
//     "ForEvt": "Cart",
//     "FrontEnd_RegNo": "80kgizbiduw5e7gg",
//     "Customerid": 17286,
//     "autocode": "00125873",
//     "Cartidlist": "",
//     "isdelete_all": 0
// }
