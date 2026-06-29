"use client";

import React, { useEffect, useState } from "react";
import ImpCards from "../impact-cards/ImpCards";
import './campaign.css'

const Campaign = () => {
  return (
    <div className="campaignMainDiv" style={{ backgroundColor: "#fff", width: "100%", height: 'auto' }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#7d7f85",
          marginTop: '80px'
        }}
      >
        <p
          style={{
            fontSize: "30px",
            letterSpacing: "1px",
            color: '#3f3151'
          }}
        >
          Honoring the Pledge
        </p>
        <p
          style={{
            width: "80%",
            textAlign: "center",
            fontSize: "25px",
            lineHeight: "28px",
            color: '#5f497a'
          }}
          className="campaignDesc"
        >
          When we band together, we can achieve the Sustainable Development Goals with unstoppable power. with only six years remaining, it is imperative that we fulfill our 2030 commitment. When we work together, we can accomplish the extraordinary, fulfill our commitment to the Sustainable Development Goals, and build the world we want to live in now and in the future.
        </p>
      </div>

      <ImpCards   />

    </div>
  );
};

export default Campaign;
