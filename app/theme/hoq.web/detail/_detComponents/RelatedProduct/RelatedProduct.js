import React from "react";
import "./related.modul.scss";

const RelatedProduct = ({
  SimilarBrandArr,
  loginInfo,
  storeInit,
  check,
  handleMoveToDetail,
}) => {
  const formatter = new Intl.NumberFormat("en-IN");
  const noimage = "./image-not-found.jpg";

  return (
    <div className="hoq_main_RelatedProduct" style={{ marginBottom: "4rem" }}>
      <div className="heading">
        <h1>Similar Designs</h1>
      </div>
      <div className="tab_card">
        {SimilarBrandArr?.slice(0, 4)?.map((hoq, i) => {
          return (
            <div
              className="TabCard_main"
              onClick={() => handleMoveToDetail(hoq)}
            >
              <div className="cardhover">
                <img
                  src={

                    // storeInit?.CDNDesignImageFol + ele?.designno + "~" + "1" + "." + ele?.ImageExtension
                    hoq?.ImageCount > 0
                      // ? storeInit?.CDNDesignImageFol +
                      //   hoq?.designno +
                      //   "~" +
                      //   "1" +
                      //   "." +
                      //   hoq?.ImageExtension
                      ? storeInit?.CDNDesignImageFolThumb +
                      hoq?.designno +
                      "~" +
                      "1" +
                      "." +
                      "jpg"
                      : noimage
                  }
                  alt={hoq?.id}
                  loading="lazy"
                  style={{
                    objectFit: "contain !important",
                  }}
                />
              </div>
              <div className="tab_hover_Details">
                <h3>{hoq?.designno}</h3>
                {check && (
                  <small>
                    {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode} &nbsp;
                    {formatter.format(hoq?.UnitCostWithMarkUp)}
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProduct;
