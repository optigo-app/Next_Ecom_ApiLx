import { wesbiteDomainName } from "../../Glob_Functions/GlobalFunction";
import { CommonFileAPI } from "../CommonAPI/CommonFileAPI";

export const BespokeAPI = async (obj = {}, fileMeta = {}, ukey) => {

  const domainname = wesbiteDomainName;

  const data = {
    FullName: obj?.FullName || "",
    InQuiryCompanyName: obj?.InQuiryCompanyName || "",
    EmailId: obj?.EmailId || "",
    mobileno: obj?.mobileno || "",
    InQuirySubject: obj?.InQuirySubject || "",
    WebSite: obj?.WebSite || "",
    Be_In_Message: obj?.Be_In_Message || "",
    Themeno: obj?.Themeno || "",
    domainname: domainname,
    FileData: JSON.stringify({
      fileName: fileMeta || "",
      uKey: ukey || "",
    }),
  };

  const payload = {
    con: JSON.stringify({
      id: "",
      mode: "BESPOKE",
      appuserid: "",
    }),
    p: JSON.stringify(data),
    f: "BESPOKE",
  };

  try {
    const res = await CommonFileAPI(payload);
    return res?.Data?.rd?.[0];
  } catch (error) {
    console.error("BespokeErr", error);
    return null;
  }
};

export const BespokeFileUploadAPI = async (file, ukey) => {
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    const folderName = "BeSpokeFileFolder";
    let formData = new FormData();
    formData.append("fileType", file);
    formData.append("folderName", folderName);
    formData.append("uKey", ukey);
    formData.append("uniqueNo", `bespoke_new_${file?.name?.split(".")[0] || Date.now()}`);

    const res = await CommonFileAPI(formData, true);

    return res;
  } catch (error) {
    console.error("BespokeFileUploadErr:", error);
    return null;
  }
};
