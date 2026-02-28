"use client";
import Headers from "./composable/Headers";
import ProductCard from "./composable/Card";
import { Box } from "@mui/material";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useEffect, useState } from "react";
import { formatRedirectTitleLine, formatter, formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { compressAndEncode } from "@/app/(core)/utils/Encoder&Decoder";

function BestSellers({ storeinit }) {
  const { finalId, loginUserDetail } = useStore();
  const [bestSellerData, setBestSellerData] = useState([]);
  const { push } = useNextRouterLikeRR();
  const [loading, setLoading] = useState(true);

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
    push(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await Get_Tren_BestS_NewAr_DesigSet_Album(storeinit, "GETBestSeller", finalId);

      if (res?.Data?.rd) {
        const validatedData = await Promise.all(
          res?.Data?.rd?.map(async (item) => {
            const imageURL = `${storeinit?.CDNDesignImageFolThumb}${item?.designno}~1.jpg`;
            return { ...item, validatedImageURL: imageURL };
          }),
        );
        setBestSellerData(validatedData);
      }
    } catch (err) {
      console.error("Error fetching GiftBlock data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAlbums();
  }, []);

  if (!loading && bestSellerData?.length == 0) {
    return null;
  }

  return (
    <>
      <Headers title="BestSellers" onViewMore={() => push(`/p/BestSeller/?B=${btoa("BestSeller")}`)} />
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
        {bestSellerData?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            minWidth="150px"
            maxWidth="150px"
            onClick={() => handleNavigation(product?.designno, product?.autocode, product?.TitleLine)}
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

export default BestSellers;
