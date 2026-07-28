"use client"

import React, { useEffect, useState } from "react";
import "./BestSellerSection.modul.scss";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import Cookies from "js-cookie";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import SonaHeader from "@/app/theme/fgstore.web/home/Header";

const BestSellerSection = ({ data, storeData }) => {
  const { push } = useNextRouterLikeRR();
  const { islogin, loginUserDetail } = useStore();
  const [imageUrl, setImageUrl] = useState();
  const [bestSellerData, setBestSellerData] = useState("");
  const [storeInit, setStoreInit] = useState({});
  const navigation = push;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [validatedData, setValidatedData] = useState([]);
  const imageNotFound = './Assets/image-not-found.jpg'

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  useEffect(() => {
    setStoreInit(storeData)
  }, [])


  useEffect(() => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const { IsB2BWebsite } = storeInit;
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    let storeinit = JSON.parse(sessionStorage.getItem("storeInit"));
    setStoreInit(storeinit);

    let data = JSON.parse(sessionStorage.getItem("storeInit"));
    // setImageUrl(data?.DesignImageFol);
    setImageUrl(data?.DesignImageFolThumb);

    Get_Tren_BestS_NewAr_DesigSet_Album(storeData, "GETBestSeller", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setBestSellerData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const checkImageAvailability = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(imageNotFound);
      img.src = url;
    });
  };

  const validateImageURLs = async () => {
    if (!bestSellerData?.length) return;
    const validatedData = await Promise.all(
      bestSellerData.map(async (item) => {
        const defaultImageURL = `${imageUrl}${item?.designno}~1.jpg`;
        const RollOverImageURL = `${imageUrl}${item?.designno}~2.jpg`;
        // const defaultImageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension}`;
        // const RollOverImageURL = `${imageUrl}${item?.designno}~2.${item?.ImageExtension}`;
        // const validatedURL1 = await checkImageAvailability(defaultImageURL);
        // const validatedURL2 = await checkImageAvailability(RollOverImageURL);
        // return { ...item, defaultImageURL: validatedURL1, RollOverImageURL: validatedURL2 };
        return { ...item, defaultImageURL: defaultImageURL, RollOverImageURL: RollOverImageURL };
      })
    );
    setValidatedData(validatedData);
  };

  useEffect(() => {
    validateImageURLs();
  }, [bestSellerData]);

  const handleNavigation = (designNo, autoCode, titleLine) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
    navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  const handleMouseEnterRing1 = (data) => {
    if (data?.ImageCount > 1) {
      setHoveredItem(data.SrNo);
    }
  };
  const handleMouseLeaveRing1 = () => {
    setHoveredItem(null);
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const chunkedData = [];
  for (let i = 0; i < validatedData?.length; i += 3) {
    chunkedData.push(validatedData?.slice(i, i + 3));
  }

  return (
    <div>
      {bestSellerData?.length != 0 && (
        <div className="fg_proCat_bestSallerMain">
          <div className="linkingLoveMain">
            <div className="linkingLove">
              <p className="linkingTitle"></p>

              <Slider {...settings}>
                {chunkedData.map((chunk, index) => (
                  <div className="linkRingLove">
                    {chunk?.map((data, dataIndex) => (
                      <div className="smr_bestselerDiv">
                        <div className="linkLoveRing1" onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine)}>
                          <img
                            src={
                              hoveredItem === data.SrNo ? data?.RollOverImageURL : data?.defaultImageURL
                              // `${imageUrl}${data.designno === undefined ? '' : data?.designno}_2.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                              // :
                              // `${imageUrl}${data.designno === undefined ? '' : data?.designno}_1.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                            }
                            className="likingLoveImages"
                            onError={(e) => {
                              e.target.src = imageNotFound;
                              e.target.alt = "no-image-found";
                            }}
                            loading="lazy"
                            alt="bestSeller"
                            onMouseEnter={() => handleMouseEnterRing1(data)}
                            onMouseLeave={handleMouseLeaveRing1}
                          />
                        </div>
                        <div className="linkLoveRing1Desc">
                          <p className="ring1Desc">{formatTitleLine(data?.TitleLine) && data?.TitleLine}</p>
                          <p className="ring1Desc">
                            {/* <span
                                                            className="smr_currencyFont"
                                                            dangerouslySetInnerHTML={{
                                                                __html: decodeEntities(
                                                                    storeInit?.Currencysymbol
                                                                ),
                                                            }}
                                                        />  */}
                            <span className="smr_currencyFont">{loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}</span> &nbsp;
                            {formatter(data?.UnitCostWithMarkUp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </Slider>
              <p className="smr_BestSallerViewAll" onClick={() => navigation(`/p/BestSeller/?B=${btoa("BestSeller")}`)}>
                SHOP COLLECTION
              </p>
            </div>
            <div className="linkingLoveImage">
              <img src={`${storImagePath()}/images/HomePage/BestSeller/promoSetMainBanner.png`} alt="bestSeller" loading="lazy" className="linkingLoveImageDesign" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSellerSection;
