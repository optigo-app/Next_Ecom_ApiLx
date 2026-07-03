"use client";

import { useState, useEffect } from 'react';
 import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import Cookies from 'js-cookie';
import { useStore } from "@/app/(core)/contexts/StoreProvider";
 


const useCountdown = () => {
 
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
    const Router = useNextRouterLikeRR().push;
          const navigation = url => Router(url);
 
      const { islogin, loginUserDetail, setislogin, cartCountNum, wishCountNum } = useStore();
    const [showTimer, setShowTimer] = useState(true);
    // const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail')) || {};
    const storedData = loginUserDetail || {};
    
    console.log("TCL: useCountdown -> loginUserDetail", loginUserDetail)
    const timerStatus = storedData?.IsTimeShow
    const entryDate = storedData.adhoc_startdate1;
    const expiryDate = storedData.adhoc_enddate1;
 


    useEffect(() => {
        let timerID
        if (timerStatus != 0 && islogin == 'true') {
            timerID = setInterval(() => tick(entryDate, expiryDate), 1000);
        }
        return () => clearInterval(timerID);
    }, [entryDate, expiryDate]);

    function calculateCountdown(startDate, endDate) {
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();
        const now = new Date().getTime();
        let timeDifference;

        if (now < startTimestamp) {
            timeDifference = startTimestamp - now;
        } else if (now > endTimestamp) {
            return { days: 0, hours: 0, minutes: 0 };
        } else {
            timeDifference = endTimestamp - now;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return {
            days,
            hours,
            minutes
        };
    }

    function tick(startDate, endDate) {
        const newCountdown = calculateCountdown(startDate, endDate);
        setCountdown(newCountdown);

        if (newCountdown.days === 0 && newCountdown.hours === 0 && newCountdown.minutes === 0 && storedData?.IsTimeShow == 0) {
            setShowTimer(false);
            handleLogout();
        }
    }

    const handleLogout = () => {
        setislogin('false');
        Cookies.remove('userLoginCookie');
        sessionStorage.setItem('LoginUser', false);
        sessionStorage.removeItem('loginUserDetail');
        sessionStorage.removeItem('remarks');
        sessionStorage.removeItem('selectedAddressId');
        sessionStorage.removeItem('orderNumber');
        sessionStorage.removeItem('registerEmail');
        sessionStorage.removeItem('UploadLogicalPath');
        sessionStorage.removeItem('remarks');
        sessionStorage.removeItem('registerMobile');
        sessionStorage.removeItem('allproductlist');
        sessionStorage.removeItem('diamondQualityColorCombo');
        sessionStorage.removeItem('metalTypeCombo');
        sessionStorage.removeItem('ColorStoneQualityColorCombo');
        sessionStorage.removeItem('MetalColorCombo');
        sessionStorage.removeItem('CompanyInfoData');
        sessionStorage.removeItem('myAccountFlags');
        sessionStorage.removeItem('CurrencyCombo');
        sessionStorage.clear();
        navigation('/')
        window.location.reload();
    }

    return {
        countdown,
        showTimer,
    }
};

export default useCountdown;
