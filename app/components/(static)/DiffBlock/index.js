import React from "react";
import "./TheDifference.modul.scss";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import Image from "next/image";

const TheDifference = () => {
  const TheDifferenceData = {
    sonasons: {
      title: "The Sonasons Difference",
      imgPath: "images/HomePage/TheDifference/sona",
      ext: "webp",
      data: [
        { title: "Natural Diamond & jewellery" },
        { title: "1% of each purchase goes to your choice of charity" },
        { title: "Laser inscribed diamonds with Sonasons logo" },
        { title: "ECG+ Certified Brand Butterfly Mark" },
      ],
    },
    omjiyansh: {
      title: "The omjiyanshjewels Difference",
      imgPath: "images/HomePage/TheDifference/om",
      ext: "png",
      data: [
        { title: "Poise in Every Detail." },
        { title: "Luxury Aesthetic, Commercial Practicality." },
        { title: "Global Reach, Trusted Quality" },
        { title: "Enduring Partnerships" },
      ],
    },
  };

  const activeData = TheDifferenceData.omjiyansh;

  return (
    <div className="smilingPAgeMain" style={{ paddingBlock: "8%" }}>
      <p className="smilingTitle">{activeData.title}</p>

      <div className="smr_smilingRock">
        {activeData.data.map((item, index) => (
          <div className="smr_smilingRockBox" key={index}>
            <div className="smr_diffrence_box1_main">
              <Image
                className="smr_deffrence_img"
                src={`/${assetBase}/${activeData.imgPath}/TheDifference${index + 1}.${activeData.ext}`}
                alt={item.title}
                width={100}
                height={100}
                sizes="(max-width: 768px) 100px, 150px"
                loading="lazy"
                style={{ height: "auto" }}
              />
            </div>
            <div className="smr_diffrence_box2_main">
              <p className="smr_smilingBoxName">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheDifference;
