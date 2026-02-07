"use client";

import React from "react";

const Payment = ({ assetBase }) => {
  return (
    <div className="payment-btn">
      <div className="pay">
        <img
          src={assetBase + `/footer/mastercard.webp`}
          alt=""
        />
      </div>
      <div className="pay">
        <img
          src={assetBase + `/footer/gpay.webp`}
          alt=""
        />
      </div>
      <div className="pay">
        <img
          src={assetBase + `/footer/visa.webp`}
          alt=""
        />
      </div>
      <div className="pay">
        <img
          src={assetBase + `/footer/paytm.webp`}
          alt=""
        />
      </div>
    </div>
  );
};

export default Payment;
