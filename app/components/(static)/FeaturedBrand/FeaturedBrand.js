"use client"

import "./FeaturedBrand.scss";

const FeaturedBrand = ({ assetBase }) => {

  const FeaturedBrandList = [
    {
      key: "image1",
      link: "https://www.jckonline.com/",
      path: `${assetBase}/featuredbard/logo2.webp`,
    },
    {
      key: "image2",
      link: "https://jgw.exhibitions.jewellerynet.com/",
      path: `${assetBase}/featuredbard/logo3.webp`,
    },
    {
      key: "image3",
      link: "",
      path: `${assetBase}/featuredbard/1 (3).webp`,
    },
    {
      key: "image4",
      link: "https://www.responsiblejewellery.com/",
      path: `${assetBase}/featuredbard/logo6.webp`,
    },
    {
      key: "image5",
      link: "",
      path: `${assetBase}/featuredbard/1 (5).webp`,
    },
    {
      key: "image6",
      link: "https://www.zara.com/",
      path: `${assetBase}/featuredbard/1 (6).webp`,
    },

  ];

  return (
    <div className="hoq_main_FeaturedBrand">
      <div className="heading">
        <h3>Featured In</h3>
      </div>
      <div className="horizontal_list">
        {FeaturedBrandList?.map((val, i) => {
          return (
            <div
              key={i}
              className="brand_card"
              onClick={() => val?.link && window.open(val.link, '_blank', 'noopener,noreferrer')}
            >
              <img src={val?.path} alt="" loading="lazy" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedBrand;
