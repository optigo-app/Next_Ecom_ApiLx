"use client";
import { useState, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";

function NewArrival({ storeinit }) {
  const { finalId, loginUserDetail } = useStore();
  const [NewArrivalsData, setNewArrivalsData] = useState([]);
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
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeObj}`);
  };

  const FetchNewArrivals = async () => {
    try {
      setLoading(true);
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETNewArrival", finalId);
      if (res?.Data?.rd) {
        const validatedData = res.Data.rd.map((item) => {
          const imageURL = `${storeinit?.CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
          return { ...item, validatedImageURL: imageURL };
        });
        setNewArrivalsData(validatedData);
      }
    } catch (err) {
      console.error("Error fetching GiftBlock data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchNewArrivals();
  }, []);

  if (!loading && NewArrivalsData?.length == 0) {
    return null;
  }

  return (
    <>
      <Headers title="New Arrivals" onViewMore={() => push(`/p/NewArrival/?N=${btoa("NewArrival")}`)} />
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
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ minWidth: "240px", width: "100%" }}>
              <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 3, bgcolor: "rgba(0,0,0,0.06)" }} />
            </Box>
          ))
          : NewArrivalsData?.map((product, index) => (
            <ProductCard
              key={`new_Arrivals_${index}`}
              product={product}
              minWidth="200px"
              maxWidth="200px"
              onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine, index)}
              image={product?.validatedImageURL}
              title={[product?.designno, product?.TitleLine && formatTitleLine(product?.TitleLine)]?.filter(Boolean)?.join(" - ")}
              // designno={product?.designno}
              price={formatter(product?.UnitCostWithMarkUp)}
            />
          ))}
      </Box>
    </>
  );
}

export default NewArrival;
