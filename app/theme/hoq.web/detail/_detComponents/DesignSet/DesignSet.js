import React from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./style.scss";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const DesignSet = ({
  storeInit,
  designSetList,
  imageNotFound,
  loginInfo,
  handleMoveToDetail,
  check
}) => {

  console.log("TCL: designSetList", JSON.parse(designSetList[0]?.Designdetail))
  const noimage = "./image-not-found.jpg";
  return (
    <div className="hoq_design_Set">
      <div className="hoq_DesignSet_main">
        {designSetList?.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <p
              style={{
                color: "#7d7f85",
                fontSize: "30px",
                // display:'none'
              }}
            >
              Complete The Look
            </p>
          </div>
        )}

        <div className="hoq_Swiper_designSet">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            // spaceBetween={50}
            // slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
          // scrollbar={{ draggable: true }}
          >
            {designSetList?.map((designSetList) => (
              <SwiperSlide>
                <div className="compeletethelook_cont">
                  <div className="hoq_ctlImg_containe">
                    <img
                      // src={
                      //   "https://cdn.accentuate.io/3245609615460/4121939443812/99-v1581576944425.jpg?2048x1950"
                      // }
                      src={
                        designSetList?.DefaultImageName
                          ? storeInit?.DesignSetImageFol +
                          designSetList?.designsetuniqueno +
                          "/" +
                          designSetList?.DefaultImageName
                          : imageNotFound
                      }
                      alt={""}
                      loading="lazy"
                      className="hoq_ctl_img"
                    />
                  </div>

                  <div
                    className={
                      (designSetList?.Designdetail == undefined
                        ? []
                        : JSON?.parse(designSetList?.Designdetail)
                      )?.length > 3
                        ? "compeletethelook_prodt_for_3"
                        : "compeletethelook_prodt"
                    }
                  >
                    <p
                      style={{
                        color: "#7d7f85",
                        fontSize: "30px",
                        display: "none",
                      }}
                    >
                      Complete The Look
                    </p>

                    {(designSetList?.Designdetail == undefined
                      ? []
                      : JSON?.parse(designSetList?.Designdetail)
                    )?.map((ele, i) => (
                      <div
                        className="completethelook_outer"
                        onClick={() => handleMoveToDetail(ele)}
                        style={{ borderTop: i !== 0 ? "none" : "" }}
                      >
                        <div style={{ display: "flex", gap: "60px" }}>
                          <div style={{ marginLeft: "12px" }}>
                            <img
                              src={

                                // storeInit?.CDNDesignImageFol + ele1?.designno + "~" + "1" + "." + ele1?.ImageExtension

                                ele?.ImageCount > 0
                                  // ? storeInit?.CDNDesignImageFol +
                                  //   ele?.designno +
                                  //   "~" +
                                  //   "1" +
                                  //   "." +
                                  //   ele?.ImageExtension
                                  ? storeInit?.CDNDesignImageFolThumb +
                                  ele?.designno +
                                  "~" +
                                  "1" +
                                  "." +
                                  "jpg"
                                  : imageNotFound
                              }
                              alt={""}
                              // src={
                              //   "https://smilingrocks.com/cdn/shop/products/Lab-grown-diamond-white-gold-earrings-sre00362wht_medium.jpg?v=1590473229"
                              // }
                              loading="lazy"
                              className="hoqthelook_img"
                              onError={(e) => {
                                e.target.src = noimage;
                              }}
                            />
                          </div>
                          <div className="hoqthelook_prodinfo">
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#7d7f85",
                                textTransform: "uppercase",
                              }}
                              className="hoqthelook_prodinfo_inner"
                            >
                              <p>
                                <span className="name_hoq_ds">  {ele?.designno} - {ele?.CategoryName}</span>
                                <br />
                                {check && (<>
                                  <span className="hoq_currencyFont">
                                    {loginInfo?.CurrencyCode ??
                                      storeInit?.CurrencyCode}
                                  </span>

                                  &nbsp;
                                  <span className="hoq_currencyFont">  {
                                    formatter(
                                      ele?.UnitCostWithMarkUp
                                    )

                                  }</span>
                                </>)}
                              </p>
                            </div>
                            {/* <div>
                          <span style={{ fontSize: "30px", color: "#7d7f85",padding:'5px'}} className=''>
                            &#8250;
                          </span>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default DesignSet;
