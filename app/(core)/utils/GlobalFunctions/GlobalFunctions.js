import { cookies } from "next/headers";
import { assetBase } from "../../lib/ServerHelper";
import fs from "fs";
import path from "path";

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
  const visitorId = cookieStore.get("visitorId")?.value ?? null;
  return visitorId;
};

export const GetUserLoginCookie = async () => {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userLoginCookie")?.value ?? null;
  return userToken;
};

export const getAboutUsContent = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "sonasonsAbout.html");
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
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", "SonasonsContactPage.html");
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
