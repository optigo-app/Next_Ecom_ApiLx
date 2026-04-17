import React from "react";
import Marquee from "react-fast-marquee";
import "./brandComponents.scss";
import { assetBase } from "@/app/(core)/lib/ServerHelper";


const BrandsComponent = () => {
  const kayralogo = ["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png", "logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png"];
  const mayrologo = ["logo1.png", "logo2.jpg", "logo3.png", "logo4.png", "logo1.png", "logo2.jpg", "logo3.png", "logo4.png", "logo1.png", "logo2.jpg", "logo3.png", "logo4.png"];
  const Omjiyanslogo = ["logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png", "logo1.png", "logo2.png", "logo3.png", "logo4.png", "logo5.png", "logo6.png", "logo7.png"];

  const sonasonsLogo = ["logo2.png", "logo3.png", "logo4.png", "logo6.png", "logo2.png", "logo3.png", "logo4.png", "logo6.png"];
  const KayralogoElements = kayralogo.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/kayra/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);
  const OmlogoElements = Omjiyanslogo?.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/omjiyansh/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);
  const MayoralogoElements = mayrologo.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/mayora/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);
  const SonasonslogoElements = sonasonsLogo.map((logo, index) => <img key={index} alt="logo" className="smr_affilitionImg" loading="lazy" src={`${assetBase}/images/HomePage/BrandLogo/sonasons/${logo}`} style={{ width: "130px", objectFit: "cover", marginRight: "90px" }} />);

  return (
    <div id="brandsComponentID" className="smr_brandsComponentsDiv">
      <p className="smr_brandsCompoents">Participation In Exhibitions</p>
      {/* For miora */}
      {/* <p className="smr_brandsCompoents">In Affiliation With</p> */}
      {/* For Sonasons */}
      {/* <p className="smr_brandsCompoents">Introducing our exclusive brands</p> */}
      <Marquee
        className="smr_brandsComponentClass"
        gradient={false}
        speed={40}
        pauseOnHover={true}
      // style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {OmlogoElements}
      </Marquee>
    </div>
  );
};

export default BrandsComponent;
