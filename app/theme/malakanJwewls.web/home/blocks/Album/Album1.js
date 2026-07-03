import React, { useState, useEffect } from 'react';
import './ShopBanner.modul.scss';
import { storImagePath } from '../../../../../../utils/Glob_Functions/GlobalFunction';
import { LiaChevronCircleRightSolid } from "react-icons/lia";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '../../../../../../utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
import { mala_loginState } from '../../../Recoil/atom';
import { useNavigate } from 'react-router-dom';
import Pako from 'pako';
import { useRecoilValue } from 'recoil';
import Cookies from 'js-cookie';
import noimagefound from './../../../Assets/image-not-found.jpg';
import { FiChevronRight } from "react-icons/fi";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { getSession } from '../../../../../../hooks/useSession';

const ShopBanner = () => {
  const [storeInit, setStoreInit] = useState();
  const islogin = useRecoilValue(mala_loginState);
  const [imageUrl, setImageUrl] = useState();
  const [albumList, setAlbumList] = useState([]);
  const [More, setMore] = useState(false);
  const [AlbumShowMore, setAlbumShowMore] = useState(6); // Start with 6 items initially
  const navigation = useNavigate();

  const apiCall = () => {
    const loginUserDetail = getSession("loginUserDetail");
    const storeInit = getSession("storeInit");
    setImageUrl(storeInit?.AlbumImageFol);
    setStoreInit(storeInit);
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (storeInit?.IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }
    Get_Tren_BestS_NewAr_DesigSet_Album("GETAlbum", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setAlbumList(response?.Data?.rd);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

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

  function handleNavigate(name) {
    navigation(`/p/${name}/?A=${btoa(`AlbumName=${name}`)}`);
  }

  useEffect(() => {
    apiCall();
  }, []);

  const Toglefun = () => {
    if (More) {
      setAlbumShowMore(6); // Show only the first 6 items when "Show Less" is clicked
    } else {
      setAlbumShowMore(albumList.length); // Show all items when "Show More" is clicked
    }
    setMore(!More); // Toggle the state to switch between "Show More" and "Show Less"
  };

  if (albumList?.length === 0) {
    return null;
  }

  return (
    <div className="mala_BottomBannerMain">
      <CategoryGrid
        More={More}
        AlbumShowMore={AlbumShowMore}
        Toglefun={Toglefun}
        data={albumList}
        imageUrl={imageUrl}
        title="Album"
      />
    </div>
  );
};

export default ShopBanner;

export const CategoryGrid = ({
  AlbumShowMore,
  More,
  Toglefun,
  title = "Find Your Forever Ring",
  data,
  imageUrl,
}) => {
  const navigation = useNavigate();

  const GenrateImage = (data) => {
    let Image;
    Image = imageUrl + data?.AlbumImageFol + "/" + data?.AlbumImageName;
    return Image;
  };

  const handleNavigate = (name) => {
    navigation(`/p/${name}/?A=${btoa(`AlbumName=${name}`)}`);
  };

  const CountTotalProducts = (alb) => {
    if (alb) {
      const res = alb && JSON?.parse(alb?.Designdetail);
      const totalresults = res?.length;
      return totalresults;
    } else {
      return 0;
    }
  };

  return (
    <>
      <div className="mala-lab-CategoryGrid">
        <div className="mala-heading">
          <h1>{title}</h1>
        </div>
        <div className="mala_grid_container">
          {data?.slice(0, AlbumShowMore)?.map((val, i) => {
            return (
              <div key={i} className="mala_card-grid">
                <div className="details_malakan_overlay" onClick={() => handleNavigate(val?.AlbumName)}>
                  <div className="total_Album_malakan">
                    <h2>{CountTotalProducts(val)} Products</h2>
                  </div>

                  <div className="view_colllec_malakan">
                    <span>
                      View The Album <FiChevronRight />
                    </span>
                  </div>
                </div>
                <div className="title" onClick={() => handleNavigate(val?.AlbumName)}>
                  <h1>{val?.AlbumName}</h1>
                </div>
                <img
                  src={GenrateImage(val)}
                  onError={(e) => {
                    e.target.src = noimagefound;
                    e.target.alt = "no-image-found";
                  }}
                  loading="lazy"
                  alt=""
                />
              </div>
            );
          })}
        </div>
        {data?.length > 6 && (
          <div className="show_mlore_btn_malaakan">
            <button onClick={Toglefun}>
              Show {More ? "Less" : "More"} {More ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
