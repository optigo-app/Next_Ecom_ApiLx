"use client";

import { useState } from "react";
import { aboutUsContent, collections } from "@/app/components/(static)/Constants/InfoList";
import "./InfoSection.modul.scss";

const InfoSection = () => {
  const [show, setshow] = useState(false);

  return (
    <div className="hoq_main_InfoSection">
      <div className="main_content">
        {aboutUsContent.map((val, i) => {
          return (
            <div className="about_card" key={i}>
              <h3>
                {"orem . Aliquam dicta beatae praesentium temporibus ex odit?" ||
                  val?.title}
              </h3>
              <p>
                {`"orem . Aliquam dicta beatae praesentium temporibus ex odit?" "orem . Aliquam dicta beatae praesentium temporibus ex odit?" "orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?" "orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?"` ||
                  val?.description}
              </p>
            </div>
          );
        })}
      </div>
      {show && (
        <>
          <div className="main_content_2">
            <h1>Our Collections</h1>
            {collections.map((val, i) => {
              return (
                <div className="about_card_2" key={i}>
                  <a href="#">
                    {`"orem . Aliquam dicta beatae praesentium ex odit?"` ||
                      val?.title}
                  </a>
                  <p>
                    {`"orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?""orem . Aliquam dicta beatae praesentium temporibus ex odit?"` ||
                      val?.description}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
      <span onClick={() => setshow(!show)}>
        {show ? 'Read Less' : 'Read More'}
      </span>
    </div>
  );
};

export default InfoSection;
