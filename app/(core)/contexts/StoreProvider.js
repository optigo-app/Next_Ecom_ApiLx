"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoreContext = createContext(null);

const toastStyle = {
  borderRadius: "6px",
  boxShadow: `  rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px`,
  minWidth: "0px",
  width: "fit-content !important",
  padding: "12px 6px !important",
  borderLeft: `8px solid teal`,
  fontSize: "18px",
};
export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartCountNum, setCartCountNum] = useState(0);
  const [wishCountNum, setWishCountNum] = useState(0);
  const [loginUserDetail, setLoginUserDetail] = useState(null);
  const [islogin, setislogin] = useState(false);
  const [cartOpenStateB2C, setCartOpenStateB2C] = useState(false);
  const [SoketData, setSoketData] = useState([])

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedDetail = sessionStorage.getItem("loginUserDetail");
    if (storedDetail) {
      const parsed = JSON.parse(storedDetail);
      setLoginUserDetail(parsed);
      setislogin(true);
    }
  }, []);

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
    setSoketData
  };

  return (
    <StoreContext.Provider value={value}>
      <ToastContainer toastStyle={toastStyle} stacked={true} hideProgressBar={true} autoClose={1400} transition={Zoom} style={{ zIndex: "9999999999999999", fontFamily: "inherit" }} />
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
