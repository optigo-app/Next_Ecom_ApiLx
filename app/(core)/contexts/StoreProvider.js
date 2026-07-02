"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "../utils/FetchSessionData";
import Cookies from "js-cookie";
import { GetCountAPI } from "../utils/API/GetCount/GetCountAPI";
import { LocalSetup } from "@/app/env";

const StoreContext = createContext({
  finalId: "",
});

const toastStyle = {
  borderRadius: "6px",
  boxShadow: `  rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px`,
  minWidth: "0px",
  width: "fit-content !important",
  padding: "12px 6px !important",
  borderLeft: `8px solid teal`,
  fontSize: "18px",
};
export function StoreProvider({ children, storeInit }) {
  const [user, setUser] = useState(null);
  const [cartCountNum, setCartCountNum] = useState(0);
  const [wishCountNum, setWishCountNum] = useState(0);
  // const [loginUserDetail, setLoginUserDetail] = useState(null);
  // const [islogin, setislogin] = useState(false);
  const [cartOpenStateB2C, setCartOpenStateB2C] = useState(false);
  const [SoketData, setSoketData] = useState([]);
  // const [authChecked, setAuthChecked] = useState(false);
  const [loginUserDetail, setLoginUserDetail] = useState(() => {
    if (typeof window === "undefined") return null;
    return getSession("loginUserDetail") || null;
  });
  
  const [islogin, setislogin] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedDetail = getSession("loginUserDetail");
    const cookie = Cookies.get("userLoginCookie");
    return !!(storedDetail || cookie);
  });
  
  // authChecked can now just always be true on the client
  const [authChecked, setAuthChecked] = useState(() => typeof window !== "undefined");

  const finalId = useMemo(() => {
    const loginUserDetail = getSession("loginUserDetail");
    const visiterID = Cookies.get("visiterId");
    if (storeInit?.IsB2BWebsite == 0) {
      return islogin === false ? visiterID : loginUserDetail?.id || "0";
    }

    return loginUserDetail?.id || "0";
  }, [islogin, storeInit]);

  useEffect(() => {
    if (finalId) {
      GetCountAPI(finalId)
        .then((res) => {
          if (res) {
            setCartCountNum(res?.cartcount);
            setWishCountNum(res?.wishcount);
          }
        })
        .catch((err) => {
          if (err) {
            console.log("getCountApiErr", err);
          }
        });
    }
  }, [finalId]);

  

  const value = {
    user,
    setUser,
    islogin,
    cartCountNum,
    setCartCountNum,
    wishCountNum,
    setWishCountNum,
    setislogin,
    loginUserDetail,
    setLoginUserDetail,
    cartOpenStateB2C,
    setCartOpenStateB2C,
    SoketData,
    setSoketData,
    finalId,
    storeInit,
    authChecked,        
    setAuthChecked,
  };

  return (
    <StoreContext.Provider value={value}>
      {LocalSetup !== "fgstore.mapp" && <ToastContainer toastStyle={toastStyle} stacked={true} hideProgressBar={true} autoClose={1400} transition={Zoom} style={{ zIndex: "9999999999999999", fontFamily: "inherit" }} />}
      {LocalSetup === "fgstore.mapp" && (
        <ToastContainer
          className="mobile_fgs_store_mapp"
          position="bottom-center"
          autoClose={2400}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          limit={6}
          stacked={true}
          transition={Zoom}
          toastStyle={{
            minWidth: "0px",
            width: "200px",
            fontSize: "12px",
            borderRadius: "20px",
            color: "#333",
            background: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1.5px 4px rgba(29,158,117,0.10)",
            marginBottom: "6px",
            padding: "6px 10px !important",
          }}
        />
      )}
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
