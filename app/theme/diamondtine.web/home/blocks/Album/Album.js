import React, { useEffect, useState } from "react";
import "./Album.modul.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "../../../../../../utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginState } from "../../../Recoil/atom";
import { useRecoilValue } from "recoil";
import noimageFound from '../../../Assets/image-not-found.jpg';


const Album = () => {
  const [albumData, setAlbumData] = useState();
  const [imageUrl, setImageUrl] = useState();
  const navigation = useNavigate();
  const islogin = useRecoilValue(loginState);

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem("storeInit"));
    setImageUrl(data?.AlbumImageFol);

    const loginUserDetail = JSON.parse(sessionStorage.getItem('loginUserDetail'));
    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
    const { IsB2BWebsite } = storeInit;
    const visiterID = Cookies.get('visiterId');
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : (loginUserDetail?.id || '0');
    } else {
      finalID = loginUserDetail?.id || '0';
    }

    Get_Tren_BestS_NewAr_DesigSet_Album("GETAlbum", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setAlbumData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleNavigate = (name) => {
    navigation(`/p/${name}/?A=${btoa(`AlbumName=${name}`)}`)
  }
  return (
    <div className="dt_alubmMainDiv">
      {albumData?.length > 0 && <p className="smr_albumTitle">Infinitely Inspiring</p>}
      <div className="smr_albumALL_div">
        {albumData?.slice(0, 5).map((data, index) => (
          <div
            key={index}
            className="smr_AlbumImageMain"
            onClick={() => handleNavigate(data?.AlbumName)}
          >
            <img
              src={imageUrl + data?.AlbumImageFol + "/" + data?.AlbumImageName}
              className="smr_AlbumImageMain_img"
              onError={(e)=>{
                e.target.src = noimageFound;
              }}
            />
            <p className="smr_albumName">{data?.AlbumName}</p>
          </div>
        ))}
      </div>
      {albumData?.length > 5 && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p className="smr_albumViveAll">View All</p>
      </div>}
    </div>
  );
};

export default Album;
