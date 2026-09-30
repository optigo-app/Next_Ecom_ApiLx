import { headers, cookies } from "next/headers";
import { getStoreInitData } from "@/app/(core)/cache_utility/storeInitCache";
import fs from "fs";
import path from "path";

const ActiveTheme = {
  contactuse: {
    Sonasons: "SonasonsContactPage.html",
    omjiyas: "OmcontactPage.html",
  },
  aboutus: {
    Sonasons: "SonasonsAbout.html",
    omjiyas: "OmAbout.html",
  }
}


function safeParse(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export const getStoreInit = async () => {
  const headersList = await headers();
  const host = headersList.get("host");
  const storeData = await getStoreInitData(host);
  return storeData?.rd?.[0] || {};
};

export const getMyAccountFlags = async () => {
  const headersList = await headers();
  const host = headersList.get("host");
  const storeData = await getStoreInitData(host);
  return storeData?.rd1 || [];
};

export const getCompanyInfoData = async () => {
  const headersList = await headers();
  const host = headersList.get("host");
  const storeData = await getStoreInitData(host);
  return storeData?.rd2?.[0] || {};
};

export const GetVistitorId = async () => {
  const cookieStore = await cookies();
  const rawId = cookieStore.get("visiterId")?.value;
  if (!rawId || rawId === "undefined" || rawId === "null" || rawId === "0") {
    return null;
  }
  return rawId;
};

export const GetUserLoginCookie = async () => {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userLoginCookie")?.value ?? null;
  return userToken;
};

export const IsUserLoggedIn = async () => {
  const cookieStore = await cookies();
  const loginUser = cookieStore.get("LoginUser")?.value;
  const userLoginCookie = cookieStore.get("userLoginCookie")?.value;
  return !!(loginUser && userLoginCookie);
};


export const getAboutUsContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", ActiveTheme.aboutus.omjiyas);
    
    console.log("TCL: getAboutUsContent ->filePath ", filePath)
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const getPrivacyHoqContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "privacyhoq.html");
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const getVimalAboutContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "vimalabout.html");
    
 
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading VimalAbout HTML file:", error);
    return null;
  }
};


export const getTermsHoqContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "termshoq.html");
    
 
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading Terms HTML file:", error);
    return null;
  }
};

export const  getTermsDiamondtineContent= async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "termsdiatine.html");
    
 
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const  getFaqDiamondtineContent= async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "faqdiatine.html");
    
  
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const  getLocationDiamondtineContent= async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "locationdiatine.html");
    
  
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const  getExchangeDiamondtineContent= async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "exchange-diatatine.html");
    
  
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const  getShipingAndReturnDiamondtineContent= async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "shipingandreturndiatine.html");
    
  
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const  getPrivacypolicyDiamondtineContent= async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "privacypolicydiatine.html");
    
  
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const getStoryHoqContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "Story.html");
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const getQualityHoqContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "hoqquality.html");
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const getCustomHoqContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "hoqcustomization.html");
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};


export const getContactUsContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", ActiveTheme.contactuse.omjiyas);
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error fetching contact HTML:", error);
    return null;
  }
};


export const getExtraFlag = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "ExtraFlag.txt");
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error fetching contact HTML:", error);
    return null;
  }
};


export const getStyleContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "ColorTheme.txt");
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error fetching contact HTML:", error);
    return null;
  }
};
