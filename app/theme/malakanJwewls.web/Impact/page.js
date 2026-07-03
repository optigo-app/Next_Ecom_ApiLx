"use client";


import React, { useEffect, useState } from "react";
import "./index.scss";
import Campaign from "./campaign/Campaign";
 

const Index = () => {

  return (
    <>
      <div
      // style={{ background: '#efe5ff' }}
      >
        <div className="back-img-container">
          <div className="impact-container2"></div>
        </div>
        <img src="Impact/banner/impactBanner1.png" alt="..." style={{ width: '100%' }} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // marginTop: "-55px",
            flexDirection: "column",
            maxWidth: "1680px",
            marginRight: "auto",
            marginLeft: "auto",
            marginTop: '50px'
          }}
          className="main-front-container"
        >

          <Campaign  />

          {/* <Explore/> */}
        </div>
        <div className="my-5" style={{ background: '#efe5ff' }}>
          <img src="Impact/banner/impactBanner2.png" alt="..." style={{ width: '100%', marginBottom: "5rem" }} />
        </div>
 
      </div>
    </>
  );
};

export default Index;
