import React from 'react'
import './TheDifference.modul.scss'
import { assetBase } from '@/app/(core)/lib/ServerHelper'
import Image from 'next/image';

const TheDifference = () => {

  const TheDifferenceData = {
    sonasons: {
      title: "The Sonasons Difference",
    },
    omjiyansh: {
      title: "The omjiyanshjewels Difference",
    }

  }
  return (
    <div className="smilingPAgeMain" style={{ paddingBlock: '8%' }}>
      <p
        className="smilingTitle"
      >
        {TheDifferenceData.sonasons.title}
      </p>

      <div className="smr_smilingRock">
        {/* First Image */}
        <div
          className="smr_smilingRockBox"
        >
          <div className="smr_diffrence_box1_main">
            <Image
              className="smr_deffrence_img"
              src={`/${assetBase}/images/HomePage/TheDifference/TheDifference1.webp`}
              alt="Natural Diamond & jewellery"
              width={100}
              height={100}
              sizes="(max-width: 768px) 100px, 150px"
              loading="lazy"
              style={{ height: 'auto' }}
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">Natural Diamond & jewellery</p>
          </div>
        </div>

        {/* Second Image */}
        <div
          className="smr_smilingRockBox"
        >
          <div className="smr_diffrence_box1_main">
            <Image
              className="smr_deffrence_img"
              src={`/${assetBase}/images/HomePage/TheDifference/TheDifference2.webp`}
              alt="1% of each purchase goes to your choice of charity"
              width={100}
              height={100}
              sizes="(max-width: 768px) 100px, 150px"
              loading="lazy"
              style={{ height: 'auto' }}
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">
              1% of each purchase goes to your choice of charity
            </p>
          </div>
        </div>

        {/* Third Image */}
        <div
          className="smr_smilingRockBox"
        >
          <div className="smr_diffrence_box1_main">
            <Image
              className="smr_deffrence_img"
              src={`/${assetBase}/images/HomePage/TheDifference/TheDifference3.webp`}
              alt="Laser inscribed diamonds with Sonasons logo"
              width={100}
              height={100}
              sizes="(max-width: 768px) 100px, 150px"
              loading="lazy"
              style={{ height: 'auto' }}
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">Laser inscribed diamonds with sonasons logo</p>
          </div>
        </div>

        {/* Fourth Image */}
        <div
          className="smr_smilingRockBox"
        >
          <div className="smr_diffrence_box1_main">
            <Image
              className="smr_deffrence_img"
              src={`/${assetBase}/images/HomePage/TheDifference/TheDifference4.webp`}
              alt="ECG+ Certified Brand Butterfly Mark"
              width={100}
              height={100}
              sizes="(max-width: 768px) 100px, 150px"
              loading="lazy"
              style={{ height: 'auto' }}
            />
          </div>
          <div className="smr_diffrence_box2_main">
            <p className="smr_smilingBoxName">ECG+ Certified Brand Butterfly Mark</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheDifference;
