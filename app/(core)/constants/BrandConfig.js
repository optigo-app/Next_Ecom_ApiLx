import { BELUX_JEWEL } from "./ElveeFlag";

export const BrandRegistry = {
  vimal: {
    name: "Vimal Gold & Diamond",
    email: "info@vimalgoldanddiamond.com",
    website: "https://vimalgoldanddiamond.com",
    address: "2106, Desh Bandhu Gupta Rd, Block 47, Beadonpura, Karol Bagh, New Delhi, Delhi, 110005",
    phone: "+91 9811290235",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.185483771353!2d77.17787!3d28.6508434!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd1a09e5519d%3A0x3b79661648bf9139!2sVimal%20Gold%20And%20Diamond!5e0!3m2!1sen!2sin!4v1776339745027!5m2!1sen!2sin"
  },
  belux: {
    name: "Belux Jewels",
    email: "info@beluxjewels.com",
    website: "https://beluxjewels.com",
    address: "Plot 42, Nebula Boulevard, Sector 9, Stardust City, Kepler-186f, Mars, 99999",
    phone: "+91 99999 88888",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.710779774643!2d77.121543!3d28.552844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMzJzEwLjIiTiA3N8KwMDcnMTcuNiJF!5e0!3m2!1sen!2sin!4v1776339745027!5m2!1sen!2sin"
  }
};

export const getBrandConfig = () => {
  if (BELUX_JEWEL === 1) {
    return BrandRegistry.belux;
  }
  return BrandRegistry.vimal;
};
