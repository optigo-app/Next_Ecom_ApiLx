import axios from "axios";
import { isLocalHost } from "@/app/(core)/constants/DomainList";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.split(":")[0];
    if (isLocalHost(hostname)) {
      return "http://newnextjs.web/api/report";
    }
  }
  return "https://apilx.optigoapps.com/api/report";
};

const getHeaders = (yearCode = "") => {
  const headers = {
    "Content-Type": "application/json",
    YearCode: yearCode,
    version: "v1",
    ver: "v1",
    sv: process.env.NODE_ENV === "production" ? 1 :  0,
    sp: "210",
  };

  return headers;
};

/**
 * Performs custom axios post for Asset Management API with sp=210, sv=0, version=v1.
 */
export const callAssetManagementAPI = async (body, yearCode = "") => {
  try {
    const url = getApiUrl();
    const headers = getHeaders(yearCode);
    const response = await axios.post(url, body, { headers });
    return response?.data;
  } catch (error) {
    console.error("callAssetManagementAPI error:", error);
    return null;
  }
};

export const GetAssetMasterAPI = async (
  params = {},
  userEmail = "",
  companyDb = "",
  yearCode = ""
) => {
  try {
    const body = {
      con: JSON.stringify({
        mode: "GETMASTER",
        appuserid: userEmail,
        PersonName: userEmail,
      }),
      p: JSON.stringify({
        CompanyDbName: companyDb,
        SearchText: params?.SearchText || "",
        PageSize: params?.PageSize || 100,
        CurrentPage: params?.CurrentPage || 1,
      }),
      f: "assetmanagementv1",
    };

    const res = await callAssetManagementAPI(body, yearCode);
    return res?.Data?.rd || [];
  } catch (error) {
    console.error("GetAssetMasterAPI error:", error);
    return [];
  }
};

export const GetAssetNodesAPI = async (
  masterId,
  userEmail = "",
  companyDb = "",
  yearCode = ""
) => {
  try {
    if (!masterId) return [];

    const body = {
      con: JSON.stringify({
        mode: "GETNODES",
        appuserid: userEmail,
        PersonName: userEmail,
      }),
      p: JSON.stringify({
        CompanyDbName: companyDb,
        MasterId: String(masterId),
      }),
      f: "assetmanagementv1",
    };

    const res = await callAssetManagementAPI(body, yearCode);
    return res?.Data?.rd || [];
  } catch (error) {
    console.error("GetAssetNodesAPI error:", error);
    return [];
  }
};

export const DownloadAssetFileAPI = async (
  nodeId,
  userEmail = "",
  companyDb = "",
  yearCode = ""
) => {
  try {
    if (!nodeId) return null;

    const body = {
      con: JSON.stringify({
        mode: "DOWNLOADFILE",
        appuserid: userEmail,
        PersonName: userEmail,
      }),
      p: JSON.stringify({
        CompanyDbName: companyDb,
        NodeId: String(nodeId),
      }),
      f: "assetmanagementv1",
    };

    const res = await callAssetManagementAPI(body, yearCode);
    return res?.Data?.rd?.[0] || null;
  } catch (error) {
    console.error("DownloadAssetFileAPI error:", error);
    return null;
  }
};

export const handleDownloadFile = async (
  node,
  onError,
  userEmail = "",
  companyDb = "",
  yearCode = ""
) => {
  if (!node?.StoragePath && !node?.storagePath) return;
  const storageUrl = node.StoragePath || node.storagePath;
  const fileName =
    node.OriginalFileName ||
    node.originalFileName ||
    node.Name ||
    node.name ||
    "download";

  try {
    const response = await fetch(storageUrl);
    if (!response.ok) throw new Error("Failed to fetch file");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed:", err);
    if (typeof onError === "function") {
      onError("Failed to download file.");
    }
    return;
  }

  // Log download asynchronously
  try {
    const nodeId = node.Id || node.id || node.NodeId;
    if (nodeId) {
      await DownloadAssetFileAPI(nodeId, userEmail, companyDb, yearCode);
    }
  } catch {
    // silent failure for log
  }
};
