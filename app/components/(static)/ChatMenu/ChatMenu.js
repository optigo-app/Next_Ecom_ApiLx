"use client";

import { useMediaQuery } from "@mui/material";
import "./ChatMenu.modul.scss";

const ChatMenu = ({ assetBase, message = "Hello, Talk to a Jewellery expert now!" }) => {

  const whatsappUrl = `https://web.whatsapp.com/send?phone=9099889962&text=${encodeURIComponent(message)}`;
  const whatsappMobileUrl = `https://api.whatsapp.com/send?phone=9099889962&text=${encodeURIComponent(message)}`;
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:899px)");

  function detectOS() {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') {
      return 'Unknown OS'; // Default value for server-side rendering
    }
    
    const userAgent = window.navigator.userAgent;

    if (/android/i.test(userAgent)) {
      return 'Android';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    } else if (/macintosh|mac os x/i.test(userAgent)) {
      return 'macOS';
    } else if (/windows nt/i.test(userAgent)) {
      return 'Windows';
    } else if (/linux/i.test(userAgent)) {
      return 'Linux';
    } else {
      return 'Unknown OS';
    }
  }

  const os = detectOS();
  const whatsappLink = (os === 'macOS' || os === 'iOS') ? whatsappMobileUrl : whatsappUrl;

  return (
    <div className="hoq_main_ChatMenu">
      <button className="wa">
        <a
          href={whatsappLink}
          target="_blank"
        >
          <img src={`${assetBase}/chatMenu/wa.png`} alt="" />
        </a>
      </button>
    </div>
  );
};

export default ChatMenu;
