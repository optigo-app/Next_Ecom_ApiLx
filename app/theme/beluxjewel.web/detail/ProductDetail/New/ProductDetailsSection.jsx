import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
  TableContainer,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ProductDetailsSection = ({
  diaList = [],
  csList = [],
  rd1 = [],
  rd2 = [],
  defaultArticleId,
  customizationDetail,
}) => {
  const targetArticleId =
    customizationDetail?.ArticleId || defaultArticleId || rd1?.[0]?.ArticleId;

  const derivedStones = React.useMemo(() => {
    if (!rd2?.length || !targetArticleId) return { dia: [], cs: [] };

    const articleStones = rd2.filter(
      (r) => r.ArticleId == targetArticleId || r.id == targetArticleId,
    );

    const dia = articleStones
      .filter((r) => r.StoneTypeid === 1)
      .map((r) => ({
        F: r.ShapeName || r.Shape || r.F || "-",
        H: r.QualityName || r.Quality || r.H || "-",
        J: r.ColorName || r.Color || r.J || "-",
        L: r.MMsize || r.Size || r.SizeName || r.L || "-",
        M: Number(r.Pieces ?? r.Pcs ?? r.PcsCount ?? r.M ?? 0),
        N: Number(r.Wt || r.Weight || r.N || 0),
      }));

    const cs = articleStones
      .filter(
        (r) => r.StoneTypeid === 2 || r.StoneTypeid === 3 || r.D === "MISC",
      )
      .map((r) => ({
        F: r.ShapeName || r.Shape || r.F || "-",
        H: r.QualityName || r.Quality || r.H || "-",
        J: r.ColorName || r.Color || r.J || "-",
        L: r.MMsize || r.Size || r.SizeName || r.L || "-",
        M: Number(r.Pieces ?? r.Pcs ?? r.PcsCount ?? r.M ?? 0),
        N: Number(r.Wt || r.Weight || r.N || 0),
        D:
          r.StoneTypeid === 3 || r.D === "MISC"
            ? "MISC"
            : r.D || r.StoneTypeName || "",
      }));

    return { dia, cs };
  }, [rd2, targetArticleId]);

  const finalDiaList = diaList?.length > 0 ? diaList : derivedStones.dia;
  const finalCsList = csList?.length > 0 ? csList : derivedStones.cs;

  const hasMisc = finalCsList?.filter((ele) => ele?.D === "MISC")?.length > 0;
  const hasColorStone =
    finalCsList?.filter((ele) => ele?.D !== "MISC")?.length > 0;

  if (!finalDiaList?.length && !hasMisc && !hasColorStone) return null;

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {finalDiaList?.length > 0 && (
        <CollapsibleSpecBox
          list={finalDiaList}
          title="Diamond Details"
          isDiamond
        />
      )}

      {hasColorStone && (
        <CollapsibleSpecBox
          list={finalCsList.filter((ele) => ele?.D !== "MISC")}
          title="Color Stone Details"
        />
      )}

      {hasMisc && (
        <CollapsibleSpecBox
          list={finalCsList.filter((ele) => ele?.D === "MISC")}
          title="MISC Details"
          isMisc
        />
      )}
    </Box>
  );
};

export default ProductDetailsSection;

const CollapsibleSpecBox = ({
  list = [],
  title = "",
  isDiamond = false,
  isMisc = false,
}) => {
  const [open, setOpen] = useState(true);

  const totalPcs = list?.reduce((acc, item) => acc + (Number(item?.M) || 0), 0);
  const totalWt = list
    ?.reduce((acc, item) => acc + (Number(item?.N) || 0), 0)
    ?.toFixed(3);

  return (
    <Box
      sx={{
        border: "1px solid #E5E5E5",
        borderRadius: 0,
        overflow: "hidden",
        bgcolor: "#FFFFFF",
      }}
    >
      {/* Header Bar */}
      <Box
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          px: 2,
          py: 1.2,
          bgcolor: "#F8F8F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
          "&:hover": { bgcolor: "#F0F0F0" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "#111111",
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.8 }}>
            <Chip
              label={`${totalPcs} Pieces`}
              size="small"
              sx={{
                height: 20,
                fontSize: "10px",
                fontWeight: 600,
                bgcolor: "#EEEEEE",
                color: "#333333",
                borderRadius: 5,
                border: "1px solid #E5E5E5",
              }}
            />
            <Chip
              label={`${totalWt} ${isMisc ? "gm" : "ct"}`}
              size="small"
              sx={{
                height: 20,
                fontSize: "10px",
                fontWeight: 600,
                bgcolor: "#EEEEEE",
                color: "#333333",
                borderRadius: 5,
                border: "1px solid #E5E5E5",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", color: "#666666" }}>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18 }} />
          )}
        </Box>
      </Box>

      {/* Collapsible Table Content */}
      <Collapse in={open}>
        <TableContainer sx={{ borderTop: "1px solid #E5E5E5" }}>
          <Table size="small" sx={{ minWidth: 280 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#666666",
                    fontSize: "11px",
                    py: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Shape
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#666666",
                    fontSize: "11px",
                    py: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Clarity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#666666",
                    fontSize: "11px",
                    py: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Color
                </TableCell>
                {isDiamond && (
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#666666",
                      fontSize: "11px",
                      py: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    Size
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#666666",
                    fontSize: "11px",
                    py: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Pcs / Wt
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((val, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "&:hover": { bgcolor: "#FAF9F6" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    sx={{ color: "#333333", fontSize: "12px", py: 0.8 }}
                  >
                    {val?.F || "-"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#333333", fontSize: "12px", py: 0.8 }}
                  >
                    {val?.H || "-"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#333333", fontSize: "12px", py: 0.8 }}
                  >
                    {val?.J || "-"}
                  </TableCell>
                  {isDiamond && (
                    <TableCell
                      sx={{ color: "#333333", fontSize: "12px", py: 0.8 }}
                    >
                      {val?.L || "-"}
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      color: "#111111",
                      fontSize: "12px",
                      fontWeight: 600,
                      py: 0.8,
                    }}
                  >
                    {`${val?.M || 0} / ${Number(val?.N || 0).toFixed(3)}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};
