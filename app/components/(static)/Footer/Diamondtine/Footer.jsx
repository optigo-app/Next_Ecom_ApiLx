"use client";


import React, { useEffect, useState } from "react";
import "./Footer.modul.scss";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import Cookies from "js-cookie";
import Link from "next/link";

export default function Footer({storeData}) {
 
  const [storeInitData, setStoreInitData] = useState();
  const [companyInfoData, setCompanuInfoData] = useState();
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { islogin, loginUserDetail } = useStore();
  const [selectedFooteVal, setSelectedVal] = useState(0);
  const [result, setResult] = useState();
  const { push } = useNextRouterLikeRR();
  const navigation = push;
 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmitNewlater = async (e) => {
    setLoading(true);

    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    e.preventDefault();
    if (email.trim() === "") {
      setLoading(false);
      setResult("Email is required.");
      return;
    } else if (!isValidEmail(email)) {
      setLoading(false);
      setResult("Please enter a valid email address.");
      return;
    } else {
      setResult("");
    }

    const storeInit = storeData;
    const newslater = storeInit?.newslatter;
    if (newslater && email) {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const newsletterUrl = `${newslater}${email}`;
      fetch(newsletterUrl)
        .then((response) => response.text())
        .then((result) => {
          setResult(result); setLoading(false); setTimeout(() => {
            setResult(""); // Clear the result after 3000 ms
            setEmail('')

          }, 3000);
        })
        .catch((error) => setResult(error));
    }
  };

  const alreadySubs = 'Already Subscribed.';

  const handleNavigte = (navigateUrl) => {
    navigation(navigateUrl);
  };

  useEffect(() => {
    const storeInit = storeData;
    setStoreInitData(storeInit);
    const companyInfoData =
      JSON.parse(sessionStorage?.getItem("CompanyInfoData")) ?? "";
    if (companyInfoData) {
      setCompanuInfoData(companyInfoData);
      const parsedSocilaMediaUrlData = companyInfoData?.SocialLinkObj;
      setSocialMediaData(parsedSocilaMediaUrlData);
    }
  }, []);

 
  const handleLogout = () => {
    navigation("/");
    setIsLogin(false);
    Cookies.remove("userLoginCookie");
    window.location.reload();
    sessionStorage.setItem("LoginUser", false);
    sessionStorage.removeItem("storeInit");
    sessionStorage.removeItem("loginUserDetail");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("selectedAddressId");
    sessionStorage.removeItem("orderNumber");
    sessionStorage.removeItem("registerEmail");
    sessionStorage.removeItem("UploadLogicalPath");
    sessionStorage.removeItem("remarks");
    sessionStorage.removeItem("registerMobile");
    sessionStorage.removeItem("allproductlist");
    sessionStorage.clear();
  };

  return (
    <div className="dt_footer_main">
      <div className="daimondFooterMain">
        <div
          className="footerNewslater"
          style={{
            paddingTop: "30px",
            paddingInline: "20%",
            marginTop: "50px",
          }}
        >
          <div className="subScriMain">
            {/* <p className='subScriMainTitle'>STAY CONNECTED FOR LATEST COLLECTIONS OFFERS</p> */}
            <p className="subScriMainTitle">LATEST COLLECTIONS & OFFERS</p>
            <form
              style={{
                width: "100%",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "20px",
              }}
              onSubmit={handleSubmitNewlater}
            >
              <input
                type="text"
                style={{padding:"5px"}}
                className="footerInputBox"
                placeholder="Your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {
                loading ? <span style={{ color: "white" }} className="elv_error_message">Loading...</span> : (
                  <>
                    {result && (
                      <span
                        className="elv_error_message"
                        style={{
                          color: result.startsWith("Thank You!") ? "#04AF70" : "#FF0000",
                          marginTop: "0px",
                          display: "block",
                        }}
                      >
                        {result}
                      </span>
                    )}
                  </>
                )}
              <button className="FooterSubBtn" onClick={handleSubmitNewlater}>
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
        <div>
          <div className="FooterLinkMain">
            <div className="FooterLinkMainBox">
              {/* <p className='footerMoteText'>ABOUT SONASONS</p> */}
              <p className="footerMoteText">ABOUT DIAMONDTIME</p>
              <p className="FoooterText">
                We are a contemporary diamond and gold jewellery brand selling
                exquisite pieces for the woman of today.
                <br />
                <span
                  onClick={() => navigation("/aboutUs")}
                  className="dt_footerLermore"
                >
                  {" "}
                  Learn More
                </span>
              </p>
            </div>
            <div className="FooterLinkMainBox">
              <p className="footerMoteText">QUICK LINKS</p>
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/faq");
                  window.scroll(0, 0);
                }}
              >
                FAQs
              </p>
              {/* <p className="FoooterTextLink" onClick={openPdf}>
                Size Guide
              </p> */}
              <p className="FoooterTextLink"
                onClick={() => {
                  navigation("/impact");
                  window.scroll(0, 0);
                }}>
                Impact
              </p>
              {/* <p className='FoooterTextLink'>Gift Cards</p> */}
              {/* <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/MaterialCore");
                  window.scroll(0, 0);
                }}
              >
                Material & Care
              </p> */}
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/aboutUs");
                  window.scroll(0, 0);
                }}
              >
                About us
              </p>
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/terms-and-conditions");
                  window.scroll(0, 0);
                }}
              >
                Terms & Conditions
              </p>
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/privacyPolicy");
                  window.scroll(0, 0);
                }}
              >
                Privacy Policy
              </p>
            </div>
            <div className="FooterLinkMainBox">
              <p className="footerMoteText">CUSTOMER SERVICE</p>
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/shiping-and-return");
                  window.scroll(0, 0);
                }}
              >
                Shipping & Returns
              </p>
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/Exchange");
                  window.scroll(0, 0);
                }}
              >
                Exchange & Buyback
              </p>
              <p
                className="FoooterTextLink"
                onClick={() => {
                  navigation("/Location");
                  window.scroll(0, 0);
                }}
              >
                Location
              </p>
              {/* <p className='FoooterTextLink'>Loyalty Program</p> */}
              {/* <p className='FoooterTextLink'>Material & Care</p> */}
              {/* <p className='FoooterTextLink'>Try at Home</p> */}
              <p
                className="FoooterTextLink"
                onClick={() => handleNavigte("/contactUs")}
              >
                Contact us
              </p>
            </div>
            {islogin == true ? (
              <div className="FooterLinkMainBox">
                <p className="footerMoteText">MY ACCOUNT</p>
                <p
                  className="FoooterTextLink"
                  onClick={() => {
                    navigation("/account");
                    window.scroll(0, 0);
                  }}
                >
                  Account
                </p>
                <p className="FoooterTextLink" onClick={handleLogout}>
                  Sign Out
                </p>
                {/* <p className='FoooterTextLink' onClick={() => navigation('/faq')}>Help</p> */}
              </div>
            ) : (
              <div className="FooterLinkMainBox">
                <p className="footerMoteText">MY ACCOUNT</p>
                <p
                  className="FoooterTextLink"
                //   onClick={() => navigation("/LoginOption")}
                >
                  
                  <Link href="/LoginOption" className="fg-footer__nav-link">
                  Sign In
          </Link>
                </p>
                {/* <p className='FoooterTextLink' onClick={() => navigation('/faq')}>Help</p> */}
              </div>
            )}
          </div>
        </div>
        <div className="footerBottom">
          
          <p className="FooterBottomText">
            Copyright © 2025 Sonasons. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
