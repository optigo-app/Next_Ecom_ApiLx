import React from "react";
import "./related.modul.scss";
import ProductCard from "../../../home/components/composable/Card";
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography' 
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const RelatedProduct = ({
  SimilarBrandArr,
  loginInfo,
  storeInit,
  check,
  handleMoveToDetail,
}) => {
  const noimage = "/fallback.jpg";

  return <>
   <Typography
          sx={{
            fontSize: "30px",
            letterSpacing: 1,
            mb: 1 ,
            px:1.5,
            mt:3 ,
            color: "rgb(125, 127, 133)",  
            textAlign :'center'
          }}
        >
          Similar Designs
        </Typography>
  
<Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1.5,
          pb: 3,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          px: 1.5,
        }}
      >
        {SimilarBrandArr?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            minWidth="150px"
            maxWidth="150px"
            onClick={() => handleMoveToDetail(product)}
            image={storeInit?.CDNDesignImageFolThumb +
                      product?.designno +
                      "~" +
                      "1" +
                      "." +
                      "jpg"}
            title={product?.designno}
            // designno={product?.designno}
            price={formatter(product?.UnitCostWithMarkUp)}
          />
        ))}
      </Box>

  </>


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
