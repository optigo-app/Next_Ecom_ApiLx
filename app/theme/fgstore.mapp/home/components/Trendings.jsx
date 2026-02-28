'use client'

import { useEffect, useState } from "react";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { Box, Skeleton } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

function Trendings({ storeinit }) {
  const { finalId, loginUserDetail } = useStore();
  const [TrendingData, setTrendingData] = useState([]);
  const { push } = useNextRouterLikeRR();
  const [loading, setLoading] = useState(true);

  const handleNavigation = (designNo, autoCode, titleLine, index) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    sessionStorage.setItem("scrollToProduct3", `product-${index}`);
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  const fetchTrendings = async () => {
    try {
      setLoading(true);
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETTrending", finalId);

      if (res?.Data?.rd) {
        const validatedData = res.Data.rd.map((item) => {
          const imageURL = `${storeinit?.CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
          return { ...item, validatedImageURL: imageURL };

        });
        setTrendingData(validatedData);
      }
    } catch (err) {
      console.error("Error fetching GiftBlock data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrendings();
  }, []);

  if (!loading && TrendingData?.length == 0) {
    return null;
  }

  return (
    <>
      <Headers title="Trending"
        onViewMore={() => push(`/p/Trending/?T=${btoa("Trending")}`)}
      />
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
        {
          loading ? (
            Array.from(new Array(4)).map((_, index) => (
              <Box key={index} sx={{ minWidth: 160, width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  width="150px"
                  height="180px"
                  sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.05)" }}
                />
              </Box>
            ))
          ) : (
            TrendingData?.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                minWidth="150px"
                maxWidth="150px"
                image={product?.validatedImageURL}
                onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)}
                price={formatter(product?.UnitCostWithMarkUp)}
                title={[
                  product?.designno,
                  product?.TitleLine && formatTitleLine(product?.TitleLine),
                ]
                  ?.filter(Boolean)
                  ?.join(" - ")
                }
              />
            ))
          )}
      </Box>
    </>
  );
}

export default Trendings;