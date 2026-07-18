import { BELUX_JEWEL } from "./ElveeFlag";

export const themeColors = {
  primary: "#114D6E", // Main Brand Blue
  primaryHover: "#0D3F5C",
  primaryLight: "#2D6D91",

  secondary: "#DCEFF8", // Section Background
  secondaryDark: "#C8E3F0",

  accent: "#C9A45A", // Luxury Gold Accent
  accentLight: "#E8D7AE",
  accentDark: "#A88435",

  background: "#FCFCFA", // Main Background
  surface: "#FFFFFF",

  text: {
    primary: "#16384F",
    secondary: "#5F7384",
    muted: "#94A3B8",
    white: "#FFFFFF",
  },

  border: "#D9E7EF",
  divider: "#EAF2F7",

  success: "#2E7D32",
  warning: "#F59E0B",
  error: "#D32F2F",
  info: "#1976D2",
};

export const palette = {
  blue: {
    50: "#F4FAFD",
    100: "#E8F4FA",
    200: "#D6EAF4",
    300: "#B8D7E8",
    400: "#7DAFCA",
    500: "#3E7FA7",
    600: "#2D678B",
    700: "#114D6E",
    800: "#0D3F5C",
    900: "#082C40",
  },

  gold: {
    50: "#FBF8F1",
    100: "#F6EFD9",
    200: "#EBD8A8",
    300: "#DEC06D",
    400: "#D1AD4B",
    500: "#C9A45A",
    600: "#B18A40",
    700: "#9A7432",
    800: "#7A5C28",
    900: "#5D441D",
  },

  neutral: {
    50: "#FCFCFA",
    100: "#F8F8F6",
    200: "#F1F2F4",
    300: "#E3E6EA",
    400: "#C5CDD4",
    500: "#9AA5B1",
    600: "#6B7280",
    700: "#475569",
    800: "#334155",
    900: "#1E293B",
  },
};

export const BrandRegistry = {
  vimal: {
    name: "Vimal Gold & Diamond",
    email: "info@vimalgoldanddiamond.com",
    website: "https://vimalgoldanddiamond.com",
    address:
      "2106, Desh Bandhu Gupta Rd, Block 47, Beadonpura, Karol Bagh, New Delhi, Delhi, 110005",
    phone: "+91 9811290235",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.185483771353!2d77.17787!3d28.6508434!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd1a09e5519d%3A0x3b79661648bf9139!2sVimal%20Gold%20And%20Diamond!5e0!3m2!1sen!2sin!4v1776339745027!5m2!1sen!2sin",
  },
  belux: {
    name: "Belux Jewels",
    email: "info@beluxjewels.com",
    website: "https://beluxjewels.com",
    address:
      "Plot 42, Nebula Boulevard, Sector 9, Stardust City, Kepler-186f, Mars, 99999",
    phone: "+91 99999 88888",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.710779774643!2d77.121543!3d28.552844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMzJzEwLjIiTiA3N8KwMDcnMTcuNiJF!5e0!3m2!1sen!2sin!4v1776339745027!5m2!1sen!2sin",
  },
};

export const getBrandConfig = () => {
  if (BELUX_JEWEL === 1) {
    return BrandRegistry.belux;
  }
  return BrandRegistry.vimal;
};
