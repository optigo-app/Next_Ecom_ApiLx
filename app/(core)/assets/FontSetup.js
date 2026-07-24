import {
  Poppins,
  Raleway,
  Outfit,
  Urbanist,
  Junge,
  Scope_One,
  Ysabeau_Infant,
  Libertinus_Sans,
} from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-urbanist",
  display: "swap",
});

export const junge = Junge({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-junge",
  display: "swap",
});

export const scopeOne = Scope_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-scope-one",
  display: "swap",
});

export const ysabeauInfant = Ysabeau_Infant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ysabeau",
  display: "swap",
});

export const libertinusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libertinus",
  display: "swap",
});

export const defaultFont = ysabeauInfant;

const fontVariableMap = new Map([
  [poppins, "--font-poppins"],
  [raleway, "--font-raleway"],
  [outfit, "--font-outfit"],
  [urbanist, "--font-urbanist"],
  [junge, "--font-junge"],
  [scopeOne, "--font-scope-one"],
  [ysabeauInfant, "--font-ysabeau"],
  [libertinusSans, "--font-libertinus"],
]);

export const defaultFontVariable =
  fontVariableMap.get(defaultFont) || "--font-ysabeau";

export const fonts = {
  default: defaultFont,
  urbanist,
  outfit,
  poppins,
  raleway,
  junge,
  scopeOne,
  ysabeauInfant,
  libertinusSans,
};
