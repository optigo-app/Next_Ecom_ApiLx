import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const storeData = safeParse(cookieStore?.get("x-store-data")?.value);
  return storeData;
};

export const getMyAccountFlags = async () => {
  const cookieStore = await cookies();
  const storeData = safeParse(cookieStore?.get("x-myAccountFlags-data")?.value);
  return storeData;
};

export const getCompanyInfoData = async () => {
  const cookieStore = await cookies();
  const storeData = safeParse(cookieStore?.get("x-CompanyInfoData-data")?.value);
  return storeData;
};

export const GetVistitorId = async () => {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visiterId")?.value || cookieStore.get("visiterId")?.value || null;
  return visitorId;
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

export const getTermsHoqContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "termshoq.html");
    
 
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
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
