import React, { useEffect, useState } from "react";
 
import './impcards.css'
 

const ImpCards = ( ) => {


  //   const [storeInit,setStoreInit] = useState();


  //   useEffect(()=>{
  //     setTimeout(()=>{
  //         if(Object.keys(JSON.parse(localStorage.getItem("storeInit")))?.length){
  //             let storeinit = JSON.parse(localStorage.getItem("storeInit"))
  //             console.log("storeinit",storeinit?.UploadLogicalPath,storeinit?.ukey,storeinit?.ufcc)
  //             setStoreInit(storeinit)
  //         }
  //     },800)
  // },[])

 

  const JsonData = [
    {
      banner: `/Impact/campaign/camp1/impactBanner2.png`,
      // icon: hat,
      title: "RESPONSIBLE SUPPLY CHAINS. HUMANRIGHTS & DUE DILIGENCE",
      descript:
        "We apply responsible supply chains, human rights, and due diligence by ensuring transparency, sourcing materials ethically, conducting supplier audits, implementing due diligence processes, collaborating with stakeholders, and continuously improving practices.",
      fund: [{ i: `/Impact/campaign/camp1/impactBanner3.png` }, { i: `/Impact/campaign/camp1/impactBanner4.png` }, { i: `/Impact/campaign/camp1/impactBanner5.png` }, { i: `/Impact/campaign/camp1/impactBanner6.png` }, { i: `/Impact/campaign/camp1/impactBanner7.png` }]
    },
    {
      banner: `/Impact/campaign/camp2/impactBanner1.png`,
      icon: "/Impact/smallicons/leaf.png",
      title: "LABOUR RIGHTS & WORKING CONDITIONS",
      descript:
        "We ensure the best labor rights and working conditions by offering fair wages, maintaining a safe work environment, prohibiting discrimination, respecting freedom of association, monitoring suppliers for compliance, providing training, establishing grievance mechanisms, and continuously improving practices.",
      fund: [{ i: `/Impact/campaign/camp2/impactBanner2.png` }, { i: `/Impact/campaign/camp2/impactBanner3.png` }, { i: `/Impact/campaign/camp2/impactBanner4.png` }, { i: `/Impact/campaign/camp2/impactBanner5.png` },{ i: `/Impact/campaign/camp2/impactBanner6.png` }]
    },
    {
      banner: `/Impact/campaign/camp3/impactBanner1.png`,
      icon: "/Impact/smallicons/heart.png",
      title: "HEALTH, SAFETY & ENVIRONMENT",
      descript:
        "We provide health, safety, and environmental safety protocols, maintaining a safe working environment, adhering to environmental regulations, and minimizing the impact of their operations on the environment through sustainable practices.",
      // counter: [
      //   { a: "20", b: "Cleft Lip Surgeries" },
      //   { a: "", b: "" },
      //   { a: "", b: "" },

      // ],
      fund: [{ i: `/Impact/campaign/camp3/impactBanner2.png` }, { i: `/Impact/campaign/camp3/impactBanner3.png` }, { i: `/Impact/campaign/camp3/impactBanner4.png` }, { i: `/Impact/campaign/camp3/impactBanner5.png` },{ i: `/Impact/campaign/camp3/impactBanner6.png` }]
    },
    {
      banner: `/Impact/campaign/camp4/impactBanner1.png`,
      icon: "/Impact/smallicons/paws.png",
      title: "RESPONSIBLE GROWING",
      descript:
        "We practice sustainable consumption by using lab-grown diamonds and ethically sourced materials, adhering to industry standards, ensuring transparency in the supply chain, and supporting initiatives that promote sustainable practices.",
      // counter: [
      //   { a: "", b: "" },
      //   { a: "", b: "" },
      //   { a: "", b: "" },

      // ],
      fund: [{ i: `/Impact/campaign/camp4/impactBanner2.png` }, { i: `/Impact/campaign/camp4/impactBanner3.png` }, { i: `/Impact/campaign/camp4/impactBanner4.png` }, { i: `/Impact/campaign/camp4/impactBanner5.png` },{ i: `/Impact/campaign/camp4/impactBanner6.png` }]
    },
  ];

  const counterFunc = (num, text, i) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: i === 0 ? '15px' : '0px' }}>
        <span style={{ color: 'black', textAlign: 'center', fontSize: '19px' }}>{num}</span>
        <p style={{ color: '#020202', fontSize: '17px' }}>{text}</p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: "70px", marginBottom: '30px' }}>
      <div
        style={{
          padding: "0px 85px 0px",
          display: "flex",
          flexDirection: "column",
          gap: '60px'
        }}
        className="impacrCardMobileMain"

      >
        {JsonData.map((jd, i) => (
          <div
            style={{
              display: "flex",
              flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              width: "100%",
              border: "1px solid #e1e1e1",
            }}
            className="impacrCardMobileMain-sub"


          >
            <div className="impacrCardMobile" style={{ width: "50%", textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: 'column',
                  color: '#7d7f85',
                  borderBottom: '1px solid #e1e1e1',
                  paddingBlock: '40px',
                  margin: '0px 60px',
                  height: '75%',
                }}
              >
                {/* <img src={jd.icon} alt={'...'} style={{ margin: '30px 0px 20px 0px' }} /> */}
                <p style={{ color: '#3f3151', fontSize: '25px' }}>{jd.title}</p>
                <p style={{ color: '#5f497a', fontSize: '16px', width: '400px', textAlign: 'center' }} className="impacrCardMobileDesc">
                  {jd.descript}
                </p>
                {/* {jd.counter.map((countData, i) => (
                  counterFunc(countData.a, countData.b, i)
                ))} */}
              </div>
              <div className="impackCardNew" style={{ display: 'flex', width: '18%', alignItems: 'center', padding: '30px 10px', marginLeft: i % 2 === 0 ? '56px' : '60px', height: '40%', gap: '10px' }}>
                {jd.fund.map((imgData) => (
                  <img src={imgData.i} alt={'...'} style={{ width: '100%' }} />
                ))}
              </div>
            </div>
            <div className="impacrCardImgMobile" style={{ width: "50%" }}>
              <img
                src={jd.banner}
                alt={"..."}
                style={{ objectFit: 'cover', height: "100%", width: '100%' }}
              />
            </div>
          </div>
        ))

        }
      </div>
    </div>
  );
};

export default ImpCards;
