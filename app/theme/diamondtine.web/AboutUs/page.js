// import "./index.scss";
// import { getAboutUsContent } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";

// export default async function AboutUs() {
//   const aboutUsContent = await getAboutUsContent();
//   return (
//     <div className="fg_smr_about_mainDiv">
//       <div className="daimondsEveryAbout">
//         <div className="smr_daimondsEveryAbout_sub" style={{ paddingBottom: "80px", minHeight: "400px" }}>
//           <div dangerouslySetInnerHTML={{ __html: aboutUsContent }} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from 'react'
import './AboutUs.modul.scss'

export default function AboutUs() {
     
    return (
        <div className='paddingTopMobileSet'
            // style={{ background: '#efe5ff' }}
            style={{ background: '#fff' }}
        >
          
            <div>
                
                <div className="dt-About-container2"></div>
            </div>
            <div className='dt-about-title'>
                <p style={{
                    textAlign: 'center',
                    fontSize: '40px',
                    color: '#3f3151',
                }}>About Us</p>
            </div>
            <div className='daimondsEveryAbout'>
                <div className='daimondsEveryAboutSub'>
                    <div style={{
                        paddingBlock: '70px'
                    }}
                        className=' daimondsEveryAboutSubTitle'
                    >
                        
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '30px',
                                color: '#3f3151'
                            }}>Let Your Love In Diamonds Be Forever.</p>
                    </div>
                    <div className='about-daimondBoxMains'>
                        <div className='about-daimondBox11'>
                            <p style={{ fontSize: '25px', color: '#3f3151' }}>ABOUT US</p>
                            <p style={{ textAlign: 'center', color: '#5f497a', fontSize: '16px' }}>Love in diamonds located amid The Diamond City Of India, Surat is a hub of explicit designs and rare shades of diamonds.
                                For over 40 years, our family has become a part of various families and their beautiful stories. We are a diamond
                                manufacturing and designing unit that strives to give a captivating combination of hue, saturation, and brilliance that
                                cannot be duplicated.
                                Our gems are a symbol of love and commitment. With sparkle, incredibly designed shapes with different shades of rare
                                colors. The precision of our cuts and the elegant craftsmanship of our artisans is our mastered tool.
                                The choice of the stone reflects the kind of personality, the color signifies the intensity of emotions and the cuts on it
                                give the reflection of the overall facets of love.
                            </p>
                        </div>
                        <div className='about-daimondBox21'>
                            <img src="/WebSiteStaticImage/Banner/about/aboutusBanner1.png" className='about-daimondBox21-image' />
                        </div>
                    </div>

                    <div className='about-daimondBoxMains' style={{ marginTop: '80px' }}>
                        <div className='about-daimondBox2'>
                            <img src="WebSiteStaticImage/Banner/about/aboutusBanner2.png" className='about-daimondBox2-image' />
                        </div>
                        <div className='about-daimondBox1'>
                            <p style={{ fontSize: '25px', color: '#3f3151' }}>VISION</p>
                            <p style={{ textAlign: 'center', color: '#5f497a', fontSize: '16px' }}>Our vision lies in adding souls to the stones. Every jewel is a statement of raw and real stories rooted in deep sentiments.
                                <br />
                                <br />
                                We believe that every stone narrates a story and our artisans give it a shape through gemstones and diamonds. Our
                                jewelry is a beautiful creation of love and commitment and our artisans hallmark it with trust to adds “forever” to it.</p>
                        </div>
                    </div>
                    
                </div>

               

                
           
            </div>
        </div>
    )
}
