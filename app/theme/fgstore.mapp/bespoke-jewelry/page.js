import React from "react";
import Bespokejewelry from "./Bespokejewelry";
import "./indexscss.scss";
const Bespoke = ({ assetBase }) => {
  return (
    <div className="smr_funfact_FooterTopMain">
      <div className="smr_funfact_FooterTopMain_sub">
        <Bespokejewelry assetBase={assetBase} />
      </div>
    </div>
  );
};

export default Bespoke;
