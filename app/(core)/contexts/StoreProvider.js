"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "../utils/FetchSessionData";
import Cookies from "js-cookie";
import { GetCountAPI, buildCartAndWishMaps } from "../utils/API/GetCount/GetCountAPI";
import { LocalSetup } from "@/app/env";
import { getOrCreateVisitorId } from "../utils/VisitorId";
import { isB2BWebsite } from "../utils/isB2B";

const StoreContext = createContext({
  isB2B: false,
  finalId: "",
  cartArr: {},
  wishArr: {},
  cartAndWishListRd1: [],
  cartCountNum: 0,
  setCartCountNum: () => {},
  wishCountNum: 0,
  setWishCountNum: () => {},
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
export function StoreProvider({ children, storeInit, initialIsLoggedIn = false }) {
  const isB2B = isB2BWebsite(storeInit);
  const [user, setUser] = useState(null);
  const [cartCountNum, setCartCountNum] = useState(0);
  const [wishCountNum, setWishCountNum] = useState(0);
  const [cartAndWishListRd1, setCartAndWishListRd1] = useState([]);
  const [cartArr, setCartArr] = useState({});
  const [wishArr, setWishArr] = useState({});

  // Keep the user detail available immediately on the client when it was already
  // persisted. The separate login flag uses a server-provided initial value below
  // so authentication-gated markup remains identical during hydration.
  const [loginUserDetail, setLoginUserDetail] = useState(() => getSession("loginUserDetail") || null);
  // Keep the first client render aligned with the server-rendered auth state.
  // Legacy session data is synchronized by the effect below after hydration.
  const [islogin, setislogin] = useState(Boolean(initialIsLoggedIn));
  const [cartOpenStateB2C, setCartOpenStateB2C] = useState(false);
  const [SoketData, setSoketData] = useState([]);

  const finalId = useMemo(() => {
    const loginUserDetail = getSession("loginUserDetail");
    const isUserLoggedIn = Boolean(islogin) && Boolean(loginUserDetail?.id);
    if (isUserLoggedIn) {
      return String(loginUserDetail.id);
    }

    if (storeInit?.IsB2BWebsite == 0) {
      const visitor = getOrCreateVisitorId(storeInit?.VisitorId);
      return visitor || "0";
    }

    return "0";
  }, [islogin, storeInit]);

  const fetchGetCountData = useCallback(async (id = finalId) => {
    let resolvedId = id;
    if (!resolvedId || resolvedId === "undefined" || resolvedId === "null" || resolvedId === "0") {
      resolvedId = finalId || getOrCreateVisitorId(storeInit?.VisitorId);
    }
    if (!resolvedId || resolvedId === "undefined") return;
    try {
      const res = await GetCountAPI(resolvedId);
      if (res) {
        if (res?.cartcount !== undefined) setCartCountNum(res.cartcount);
        if (res?.wishcount !== undefined) setWishCountNum(res.wishcount);
        if (Array.isArray(res?.rd1)) {
          setCartAndWishListRd1(res.rd1);
          const { newCartObj, newWishObj } = buildCartAndWishMaps(res.rd1);
          setCartArr(newCartObj);
          setWishArr(newWishObj);
        }
      }
      return res;
    } catch (err) {
      console.log("getCountApiErr", err);
      // Unblock UI: mark maps hydrated so cart/wish buttons don't stay
      // in skeleton state forever when the count API fails.
      setCartArr((prev) => (prev?.__hydrated ? prev : { ...prev, __hydrated: true }));
      setWishArr((prev) => (prev?.__hydrated ? prev : { ...prev, __hydrated: true }));
    }
    return null;
  }, [finalId]);

  useEffect(() => {
    if (finalId) {
      fetchGetCountData(finalId);
    }
  }, [finalId, fetchGetCountData]);

  useEffect(() => {
    // Belt-and-suspenders: if lazy initializer missed the session (e.g. race with
    // cookie fallback), sync it up now. setState with the same value is a no-op
    // in React 18 — no extra re-render when state is already correct.
    if (typeof window === "undefined") return;
    const storedDetail = getSession("loginUserDetail");
    if (storedDetail && !islogin) {
      setLoginUserDetail(storedDetail);
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
    setSoketData,
    finalId,
    storeInit,
    isB2B,
    cartAndWishListRd1,
    setCartAndWishListRd1,
    cartArr,
    setCartArr,
    wishArr,
    setWishArr,
    fetchGetCountData,
  };


  return (
    <StoreContext.Provider value={value}>
      {LocalSetup !== "fgstore.mapp" && (
        <ToastContainer
          toastStyle={toastStyle}
          stacked={true}
          hideProgressBar={true}
          autoClose={1400}
          transition={Zoom}
          style={{ zIndex: "9999999999999999", fontFamily: "inherit" }}
        />
      )}
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
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.10), 0 1.5px 4px rgba(29,158,117,0.10)",
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
