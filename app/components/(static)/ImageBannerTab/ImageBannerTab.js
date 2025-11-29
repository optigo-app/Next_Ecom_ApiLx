"use client";

import "./ImageBannerTab.scss";

const ImageBannerTab = ({ assetsBase }) => {
  return (
    <>
      <div className="hoq_main_ImageBannerTab">
        <div className="banner">
          <img
            src={`${assetsBase}/imageBanner/cert.webp`}
            alt=""
          />
        </div>
        <button>
          <a
            href={`${assetsBase}/imageBanner/guide.pdf`}
            target="_blank"
          >
            View sample certificate
          </a>
        </button>
      </div>

      <div className="MOBILE_BANNER">
        {/* PASS assetsBase HERE */}
        <MobileImageBannerTab assetsBase={assetsBase} />
      </div>
    </>
  );
};

export default ImageBannerTab;


// =======================
// MOBILE COMPONENT
// =======================

const MobileImageBannerTab = ({ assetsBase }) => {
  return (
    <>
      <div className="banner">
        <img
          src={`${assetsBase}/imageBanner/mobcert.webp`}
          alt="HOQ"
        />
      </div>

      <p>
        HOQ believes that your diamonds should empower you, and we make sure we
        stick by our promise in more ways than one.
      </p>

      <button>Read More</button>

      <button>
        <a
          href={`${assetsBase}/imageBanner/guide.pdf`}
          target="_blank"
        >
          View sample certificate
        </a>
      </button>
    </>
  );
};
