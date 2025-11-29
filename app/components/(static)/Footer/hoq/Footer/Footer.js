"use client";

import React, { useEffect, useState } from "react";
import "./Footer.modul.scss";
import Payment from "./Payment";
import MobileFooter from "./MobileFooter";
import Link from "next/link";

const Footer = ({ companyInfoData, storeData, extraFlag, logos, assetBase }) => {

  const [email, setemail] = useState("");
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [selectedFooteVal, setSelectedVal] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let interval;
    const fetchData = () => {
      try {
        const storeInitData = storeData;
        if (storeInitData) {
          const companyInfoDataStr = companyInfoData;
          if (companyInfoDataStr) {
            // Check if companyInfoDataStr is already an object
            const parsedCompanyInfo = typeof companyInfoDataStr === 'string'
              ? JSON.parse(companyInfoDataStr)
              : companyInfoDataStr;

            const socialLinkStr = parsedCompanyInfo?.SocialLinkObj;
            if (socialLinkStr) {
              try {
                // Check if socialLinkStr is already an object
                const parsedSocialMediaData = typeof socialLinkStr === 'string'
                  ? JSON.parse(socialLinkStr)
                  : socialLinkStr;
                setSocialMediaData(parsedSocialMediaData);
              } catch (error) {
                console.error("Error parsing social media data:", error);
                // If parsing fails, try to use it as is if it's an object
                if (typeof socialLinkStr === 'object') {
                  setSocialMediaData(socialLinkStr);
                }
              }
            }
          }

          setLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        setLoading(false);
        clearInterval(interval);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for continuous checking
    interval = setInterval(fetchData, 1000);

    // Cleanup function to clear interval on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [companyInfoData, storeData]); // Add dependencies to prevent stale closures


  const HandleFormSubmit = async (e) => {
    setLoading1(true);

    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    e.preventDefault();
    if (email.trim() === "") {
      setLoading1(false);
      setResult("Email is required.");
      return;
    } else if (!isValidEmail(email)) {
      setLoading1(false);
      setResult("Please enter a valid email address.");
      return;
    } else {
      setResult("");
    }

    const storeInit = JSON?.parse(sessionStorage?.getItem("storeInit"));
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
          setResult(result); setLoading1(false); setTimeout(() => {
            setResult(""); // Clear the result after 3000 ms
            setemail('')

          }, 3000);
        })
        .catch((error) => setResult(error));
    }
  };


  return (
    <div className="hoq_main_footer">
      <footer className="footer">
        <div className="footer-content">
          <ContactInformation socialLinkStr={socialMediaData} companyInfoData={companyInfoData} />
          <NewsLetter
            onsubmit={HandleFormSubmit}
            email={email}
            setemail={setemail}
            loading1={loading1}
            result={result}
          />
          <Policy />
          <About />
        </div>
        <Copyright assetBase={assetBase} />
      </footer>
      <MobileFooter socialLinkStr={socialMediaData} companyInfoData={companyInfoData} assetBase={assetBase} />

    </div>
  );
};

const About = () => {
  return (
    <div className="footer-section about-hoq">
      <h4>ABOUT</h4>
      <ul>
        {/* <li>
          <Link href="/blogs">Blogs</Link>
        </li> */}
        <li>
          <Link href="/ourStory">Our Story</Link>
        </li>
        <li>
          <Link href="/bespoke-jewelry">Bespoke Jewellery</Link>
        </li>
        <li>
          <Link href="/appointment">Appointment</Link>
        </li>
        {/* <li>
          <Link href="/size-guide">Size Guide</Link>
        </li> */}
        {/* <li>
          <Link href="/lab-grown-diamond">Lab Grown Diamond</Link>
        </li> */}
        {/* <li>
          <Link href="/diamond-education">Diamond Education</Link>
        </li> */}
        {/* <li>
          <Link href="/quality-certification">Quality & Certification</Link>  
        </li> */}
      </ul>
    </div>
  );
};
const Policy = () => {
  return (
    <div className="footer-section">
      <h4>POLICIES</h4>
      <ul>
        <li>
          <Link href="/privacyPolicy">Privacy Policy</Link>
        </li>
        {/* <li>
          <Link href="/Shipping-Policy">Shipping Policy</Link>
        </li> */}
        {/* <li>
          <Link href="/Return-Exchange-Policy">Return & Exchange Policy</Link>
        </li> */}
        <li>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </li>
        {/* <li>
          <Link href="/faq">FAQs</Link>
        </li> */}
        <li>
          <Link href="/contactUs">Contact</Link>
        </li>
      </ul>
    </div>
  );
};
const NewsLetter = ({ onsubmit, email, setemail, loading1, result }) => {
  const alreadySubs = 'Already Subscribed.';
  return (
    <div className="footer-section">
      <h4>NEWSLETTER</h4>
      <p className="address_hoq">
        Subscribe to get special offers, new collection launches, and
        once-in-a-while deals.
      </p>
      <form className="subscribe-form" onSubmit={onsubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          name="email"
          onChange={(e) => setemail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
      {
        loading1 ? <span className="hoq_error_message" style={{ color: 'black' }}>Loading...</span> : (
          <>
            {result && (
              <span
                className="hoq_error_message"
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
    </div>
  );
};
const Copyright = ({ assetBase }) => {
  return (
    <div className="footer-bottom">
      <Payment assetBase={assetBase} />
      <p>© 2025 Lorem ipsum dolor sit amet.</p>
    </div>
  );
};
const ContactInformation = ({ socialLinkStr, companyInfoData }) => {
  return (
    <div className="footer-section">
      <h4>CONTACT US</h4>
      <p className="add_hoq_new_kl">
        {companyInfoData?.FrontEndAddress},
        <br />
        {companyInfoData?.FrontEndCity},
        <br />
        {companyInfoData?.FrontEndState},
        <br />
        {companyInfoData?.FrontEndZipCode}
      </p>
      <p>
        Mob. {companyInfoData?.FrontEndContactno1}
        <br />
        Email:     {companyInfoData?.FrontEndEmail1}
      </p>
      <div className="social-links">
        {
          socialLinkStr?.map((val, i) => {
            return <React.Fragment key={i}>
              <Link
                key={i}
                href={val?.SLink}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
                target="_blank"
              >
                <img src={val?.SImgPath} alt="" width={15} height={15} style={{
                  mixBlendMode: "darken"
                }} />
                {val?.SName}
              </Link>
            </React.Fragment>
          })
        }
      </div>
    </div>
  );
};

export default Footer;
{/* <Link
          href="https://www.facebook.com/"
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
          target="_blank"
        >
          <FaFacebook size={17} color="blue" />
          Facebook
        </Link> */}