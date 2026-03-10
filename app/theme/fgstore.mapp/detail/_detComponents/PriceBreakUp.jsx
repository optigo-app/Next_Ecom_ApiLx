import React from "react";
import { Box, Typography, Divider, Paper, Stack } from "@mui/material";


    const decodeEntities = (html) => {
        if (!html || typeof html !== "string") return html;
        if (typeof window === "undefined") return html;

        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

const PriceBreakup = ({
  storeInit,
  singleProd,
  singleProd1,
  loginInfo
}) => {


  const prod = singleProd ?? singleProd1;

  const currency = (
    <span
      style={{ paddingRight: "0.35rem" }}
      dangerouslySetInnerHTML={{
        __html: decodeEntities(loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode ),
      }}
    />
  );

  const metal = prod?.Metal_Cost;
  const diamond = prod?.Diamond_Cost;
  const stone = prod?.ColorStone_Cost;
  const misc = prod?.Misc_Cost;
  const labour = prod?.Labour_Cost;


  const other =
    (prod?.Other_Cost || 0) +
    (prod?.Size_MarkUp || 0) +
    (prod?.DesignMarkUpAmount || 0) +
    (prod?.ColorStone_SettingCost || 0) +
    (prod?.Diamond_SettingCost || 0) +
    (prod?.Misc_SettingCost || 0);

  if (
    !(storeInit?.IsPriceShow === 1 &&
      storeInit?.IsPriceBreakUp == 1 &&
      prod?.IsMrpBase !== 1)
  ) return null;

  const Row = ({ label, value }) =>
    value !== 0 ? (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ py: 0.4 }}
      >
        <Typography sx={{ fontSize: "0.9rem", color: "#616161" }}>
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center"
          }}
        >
          {currency}
          {value?.toFixed(2)}
        </Typography>
      </Stack>
    ) : null;

  return (

      <Box
        sx={{
            boxSizing:'border-box',
            width:'100%',
        }}
        >
    
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 1,
        borderRadius: 2,
        border: "1px solid #eee",
        background: "#fff",
        
      }}
    >

      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          mb: 1,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "#424242"
        }}
      >
        Price Breakup
      </Typography>

      <Divider sx={{ mt: 1.5 ,mb:1 }} />

      <Box>

        <Row label="Metal" value={metal} />
        <Row label="Diamond" value={diamond} />
        <Row label="Stone" value={stone} />
        <Row label="Misc" value={misc} />
        <Row label="Labour" value={labour} />
        <Row label="Other" value={other} />

      </Box>


    </Paper>
    </Box>
  );
};

export default PriceBreakup;

//    {storeInit?.IsPriceShow === 1 && storeInit?.IsPriceBreakUp == 1 && (singleProd1 ?? singleProd)?.IsMrpBase !== 1 && (
                        //         <Accordion
                        //             className="accordian"
                        //             key={3}
                        //             sx={{
                        //                 border: "none", // Remove default border
                        //                 boxShadow: "none", // Remove default shadow
                        //                 "&:before": {
                        //                     // Remove the border-top pseudo-element
                        //                     display: "none",
                        //                 },
                        //             }}
                        //             expanded={expandedIndex === 3}
                        //             onChange={handleChange(3)}
                        //         >
                        //             <AccordionSummary
                        //                 expandIcon={
                        //                     expandedIndex === 3 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />
                        //                     // <AddIcon
                        //                     //   style={{ fontSize: "1.2rem", color: "black" }}
                        //                     // />
                        //                 }
                        //                 aria-controls="panel1-content"
                        //                 id="panel1-header"
                        //                 className="summary-fgstore_mapp"
                        //                 sx={{
                        //                     padding: "0 5px",
                        //                 }}
                        //             >
                        //                 <Typography
                        //                     className="title"
                        //                     sx={{
                        //                         textAlign: "center",
                        //                         width: "100%",
                        //                     }}
                        //                     style={{
                        //                         fontSize: "0.9rem",
                        //                         textTransform: "uppercase",
                        //                         marginLeft: "3.4px",
                        //                     }}
                        //                 >
                        //                     Price Breakup
                        //                 </Typography>
                        //             </AccordionSummary>
                        //             <AccordionDetails>
                        //                 {(singleProd1?.Metal_Cost ? singleProd1?.Metal_Cost : singleProd?.Metal_Cost) !== 0 ? (
                        //                     <div
                        //                         style={{
                        //                             display: "flex",
                        //                             justifyContent: "space-between",
                        //                             alignItems: "center",
                        //                         }}
                        //                     >
                        //                         <Typography className="smr_Price_breakup_label">Metal</Typography>
                        //                         <span style={{ display: "flex" }}>
                        //                             <Typography>
                        //                                 {
                        //                                     <span
                        //                                         style={{ paddingRight: "0.4rem" }}
                        //                                         className="smr_currencyFont"
                        //                                         dangerouslySetInnerHTML={{
                        //                                             __html: decodeEntities(loginInfo?.CurrencyCode),
                        //                                         }}
                        //                                     />
                        //                                 }
                        //                             </Typography>
                        //                             <Typography>{(singleProd1?.Metal_Cost ? singleProd1?.Metal_Cost : singleProd?.Metal_Cost)?.toFixed(2)}</Typography>
                        //                         </span>
                        //                     </div>
                        //                 ) : null}
                        //                 {(singleProd1?.Diamond_Cost ? singleProd1?.Diamond_Cost : singleProd?.Diamond_Cost) !== 0 ? (
                        //                     <div
                        //                         style={{
                        //                             display: "flex",
                        //                             justifyContent: "space-between",
                        //                             alignItems: "center",
                        //                         }}
                        //                     >
                        //                         <Typography className="smr_Price_breakup_label">Diamond </Typography>

                        //                         <span style={{ display: "flex" }}>
                        //                             <Typography>
                        //                                 {
                        //                                     <span
                        //                                         style={{ paddingRight: "0.4rem" }}
                        //                                         className="smr_currencyFont"
                        //                                         dangerouslySetInnerHTML={{
                        //                                             __html: decodeEntities(loginInfo?.CurrencyCode),
                        //                                         }}
                        //                                     />
                        //                                 }
                        //                             </Typography>
                        //                             <Typography>{(singleProd1?.Diamond_Cost ? singleProd1?.Diamond_Cost : singleProd?.Diamond_Cost)?.toFixed(2)}</Typography>
                        //                         </span>
                        //                     </div>
                        //                 ) : null}

                        //                 {(singleProd1?.ColorStone_Cost ? singleProd1?.ColorStone_Cost : singleProd?.ColorStone_Cost) !== 0 ? (
                        //                     <div
                        //                         style={{
                        //                             display: "flex",
                        //                             justifyContent: "space-between",
                        //                             alignItems: "center",
                        //                         }}
                        //                     >
                        //                         <Typography className="smr_Price_breakup_label">Stone </Typography>

                        //                         <span style={{ display: "flex" }}>
                        //                             <Typography>
                        //                                 {
                        //                                     <span
                        //                                         style={{ paddingRight: "0.4rem" }}
                        //                                         className="smr_currencyFont"
                        //                                         dangerouslySetInnerHTML={{
                        //                                             __html: decodeEntities(loginInfo?.CurrencyCode),
                        //                                         }}
                        //                                     />
                        //                                 }
                        //                             </Typography>
                        //                             <Typography>{(singleProd1?.ColorStone_Cost ? singleProd1?.ColorStone_Cost : singleProd?.ColorStone_Cost)?.toFixed(2)}</Typography>
                        //                         </span>
                        //                     </div>
                        //                 ) : null}

                        //                 {(singleProd1?.Misc_Cost ? singleProd1?.Misc_Cost : singleProd?.Misc_Cost) !== 0 ? (
                        //                     <div
                        //                         style={{
                        //                             display: "flex",
                        //                             justifyContent: "space-between",
                        //                             alignItems: "center",
                        //                         }}
                        //                     >
                        //                         <Typography className="smr_Price_breakup_label">MISC </Typography>

                        //                         <span style={{ display: "flex" }}>
                        //                             <Typography>
                        //                                 {
                        //                                     <span
                        //                                         style={{ paddingRight: "0.4rem" }}
                        //                                         className="smr_currencyFont"
                        //                                         dangerouslySetInnerHTML={{
                        //                                             __html: decodeEntities(loginInfo?.CurrencyCode),
                        //                                         }}
                        //                                     />
                        //                                 }
                        //                             </Typography>
                        //                             <Typography>{(singleProd1?.Misc_Cost ? singleProd1?.Misc_Cost : singleProd?.Misc_Cost)?.toFixed(2)}</Typography>
                        //                         </span>
                        //                     </div>
                        //                 ) : null}

                        //                 {(singleProd1?.Labour_Cost ? singleProd1?.Labour_Cost : singleProd?.Labour_Cost) !== 0 ? (
                        //                     <div
                        //                         style={{
                        //                             display: "flex",
                        //                             justifyContent: "space-between",
                        //                             alignItems: "center",
                        //                         }}
                        //                     >
                        //                         <Typography className="smr_Price_breakup_label">Labour </Typography>

                        //                         <span style={{ display: "flex" }}>
                        //                             <Typography>
                        //                                 {
                        //                                     <span
                        //                                         style={{ paddingRight: "0.4rem" }}
                        //                                         className="smr_currencyFont"
                        //                                         dangerouslySetInnerHTML={{
                        //                                             __html: decodeEntities(loginInfo?.CurrencyCode),
                        //                                         }}
                        //                                     />
                        //                                 }
                        //                             </Typography>
                        //                             <Typography>{(singleProd1?.Labour_Cost ? singleProd1?.Labour_Cost : singleProd?.Labour_Cost)?.toFixed(2)}</Typography>
                        //                         </span>
                        //                     </div>
                        //                 ) : null}

                        //                 {(singleProd1?.Other_Cost ? singleProd1?.Other_Cost : singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ? singleProd1?.Size_MarkUp : singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ? singleProd1?.DesignMarkUpAmount : singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ? singleProd1?.ColorStone_SettingCost : singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ? singleProd1?.Diamond_SettingCost : singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ? singleProd1?.Misc_SettingCost : singleProd?.Misc_SettingCost) !== 0 ? (
                        //                     <div
                        //                         style={{
                        //                             display: "flex",
                        //                             justifyContent: "space-between",
                        //                             alignItems: "center",
                        //                         }}
                        //                     >
                        //                         <Typography className="smr_Price_breakup_label">Other </Typography>

                        //                         <span style={{ display: "flex" }}>
                        //                             <Typography>
                        //                                 {
                        //                                     <span
                        //                                         style={{ paddingRight: "0.4rem" }}
                        //                                         className="smr_currencyFont"
                        //                                         dangerouslySetInnerHTML={{
                        //                                             __html: decodeEntities(loginInfo?.CurrencyCode),
                        //                                         }}
                        //                                     />
                        //                                 }
                        //                             </Typography>
                        //                             <Typography>{((singleProd1?.Other_Cost ? singleProd1?.Other_Cost : singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ? singleProd1?.Size_MarkUp : singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ? singleProd1?.DesignMarkUpAmount : singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ? singleProd1?.ColorStone_SettingCost : singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ? singleProd1?.Diamond_SettingCost : singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ? singleProd1?.Misc_SettingCost : singleProd?.Misc_SettingCost))?.toFixed(2)}</Typography>
                        //                         </span>
                        //                     </div>
                        //                 ) : null}
                        //             </AccordionDetails>
                        //         </Accordion>
                        //     )}