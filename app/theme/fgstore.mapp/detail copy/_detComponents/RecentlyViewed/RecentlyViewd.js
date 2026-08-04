import React from "react";
import { Link } from "react-router-dom";
import { RelatedProductList } from "@/app/components/(static)/Constants/TabImages";
import "./RecenltyViewed.modul.scss";

const RecentlyViewd = () => {
  return (
    <div className="hoq_main_RecenltyViewed">
      <div className="heading">
        <h1>Recently viewed </h1>
      </div>
      <div className="tab_card">
        {RelatedProductList?.map((val, i) => {
          return (
            <Link to={`/products/${val?.id}`}>
              <div className="TabCard_main">
                <div className="new">
                  <p>new</p>
                </div>
                <div className="cardhover">
                  <img src={val?.FrontImg} alt={val?.id} />
                  <div className="overlay_img">
                    <img src={val?.BackerImg} alt={val?.id} />
                  </div>
                </div>
                <div className="tab_hover_Details">
                  <h3>{i + 1} ct Heart Ring</h3>
                  <small>INR 79,000</small>
                </div>
              </div>
            </Link>
          );
        })}
        {/* <div className="TabCard_main mobile-only">
        <div className="box">
          <Link to={"/"}>View All 106 Products</Link>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default RecentlyViewd;
