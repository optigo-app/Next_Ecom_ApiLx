"use client";

import React, { useEffect, useState } from 'react';
import './printCart.scss';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import { formatter } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const PrintPageCard = ({ storeinit }) => {
  const { finalCartData } = useCart();
  const { loginUserDetail } = useStore();

  const noImageFound = "/image-not-found.jpg";

  const [imageSrcs, setImageSrcs] = useState({});
  const storeInitData = storeinit;
  const loginInfo = loginUserDetail

  const CDNDesignImageFolThumb = storeInitData?.CDNDesignImageFolThumb;

  useEffect(() => {
    if (finalCartData) {
      const newImageSrcs = {};

      finalCartData.forEach((card) => {
        if (card?.ImageCount > 0) {
          newImageSrcs[card?.id] = card?.images;
        } else {
          newImageSrcs[card?.id] = noImageFound;
        }
      });

      setImageSrcs((prevState) => ({
        ...prevState,
        ...newImageSrcs,
      }));
    }
  }, [finalCartData]);

  return (
    <div className='printPage'>
      <div className="print-header" aria-hidden="true">
        <img src={storeInitData && storeInitData?.companylogo} alt="Logo" className="print-logo" />
        <p>Cart Summary</p>
      </div>

      <div className="printPage">
        {finalCartData?.map((card) => (
          <div className="printPage-card" key={card?.id}>
            <div className="image">
              <img
                src={imageSrcs[card?.id] || noImageFound}
                alt={card?.TitleLine}
                loading='lazy'
                onError={(e) => {
                  if (card?.ImageCount > 0) {
                    e.target.src = `${CDNDesignImageFolThumb}${card?.designno}~1.jpg`
                  } else {
                    e.target.src = noImageFound;
                  }
                }}
              />
            </div>
            <div className="content">
              <div className="header">
                <span>
                  {card?.designno}
                  {card?.TitleLine ? ` - ${card?.TitleLine}` : ""}
                </span>
              </div>
              <div className="price">
                <span>{loginInfo?.CurrencyCode ?? storeInitData?.CurrencyCode}</span>&nbsp;
                {formatter(card?.UnitCostWithMarkUp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


};

export default PrintPageCard;
