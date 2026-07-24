"use client";

import React from "react";
import "./CompanyData.modul.scss";

const versionData = [
  {
    version: 1,
    data: [
      { title: "Established Excellence", description: "A legacy of success, driven by passion and innovation" },
      { title: "7", description: " Working Year" },
      { title: "300+ ", description: "Happy Retailers" },
      { title: "20000+ ", description: "Design" },
      { title: "75000+ ", description: "Sq Feet Factory Size" },
    ],
  },
  {
    version: 2,
    data: [
      { title: "7+ ", description: "Years of Excellence" },
      { title: "300+ ", description: "Satisfied Clients" },
      { title: "20,000+ ", description: "Unique Designs" },
      { title: "75,000+ ", description: "sq. ft. Factory" },
    ],
  },
];

const currentversion = versionData[1];

function CompanyData() {
  return (
    <div className="el_companyData_main" style={{ marginBlock: "1rem",marginTop:"55px" }}>
      <div className="banner-stats">
        <div className="stat">
          <div>
            <span className="firstspantag">Established Excellence</span>
            <p className="firstptag">A legacy of success, driven by passion and innovation</p>
          </div>
        </div>
        <div className="stat rightBorder">
          <div>
            <span className="firstSpanData">{currentversion.data[0].title}</span>
            <p className="ptag">{currentversion.data[0].description}</p>
          </div>
        </div>
        <div className="stat rightBorder">
          <div>
            <span className="firstSpanData">{currentversion.data[1].title}</span>
            <p className="ptag">{currentversion.data[1].description}</p>
          </div>
        </div>
        <div className="stat rightBorder">
          <div>
            <span className="firstSpanData">{currentversion.data[2].title}</span>
            <p className="ptag">{currentversion.data[2].description}</p>
          </div>
        </div>
        <div className="stat">
          <div>
            <span className="firstSpanData">{currentversion.data[3].title}</span>
            <p className="ptag">{currentversion.data[3].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyData;
