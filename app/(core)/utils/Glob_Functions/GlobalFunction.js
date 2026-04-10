import { NEXT_APP_WEB } from "../env";
import { getSession } from "../FetchSessionData";


export function storImagePath() {
  if (typeof window === "undefined") {
    // fallback for SSR (server render)
    return `${NEXT_APP_WEB}/WebSiteStaticImage`;
  }

  let statiPath = `${window?.location?.protocol}//${window.location.hostname === "localhost" || window.location.hostname === "zen"
    ? NEXT_APP_WEB
    : window.location.hostname
    }`;

  return `${statiPath}/WebSiteStaticImage`;
}


export function storImagePathNew() {
  let statiPath = `${window?.location?.protocol}//${(window.location.hostname === 'localhost'
    || window.location.hostname === 'zen')
    ? NEXT_APP_WEB
    : window.location.hostname}`
  return `${statiPath}/Website_Store`
}

export const getDomainName = async () => {
  try {
    const { hostname } = window.location;
    if (!hostname) {
      throw new Error("Hostname is not available.");
    }
    const domainMap = {
      "almacarino.procatalog.in": "almacarino",
      "shreediamond.optigoapps.com": "sdj",
      'apptstore.orail.co.in': 'sdj',
      'fgstore.mapp': 'sdj',
      'varajewels.com': "vaara",
      'www.varajewels.com': "vaara",
      'sonasons.optigoapps.com': "demo",
      'uscreation.procatalog.in': "uscreation",
      'thereflections.procatalog.in': "saraff",
      'localhost': "default",
    };
    return domainMap[hostname] || "default";
  } catch (error) {
    console.error("Error in getDomainName:", error);
    return "default";
  }
};

export function storInitDataPath() {
  let hostName =
    window.location.hostname === "localhost" ||
      window.location.hostname === "zen"
      ? NEXT_APP_WEB
      : window.location.hostname;
  if (hostName?.startsWith("www.")) {
    hostName = hostName.substring(4);
  }
  let statiPath = `${window?.location?.protocol}//${hostName}`;
  return `${statiPath}/Website_Store/WebSiteStaticImage/${hostName}`;
}

// export function storInitDataPath() {
//   let statiPath = `${window?.location?.protocol}//${(window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.web' : window.location.hostname}`
//   let hostName = `${window?.location?.protocol}//${(window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.web' : window.location.hostname}`
//   return `${statiPath}/Website_Store/WebSiteStaticImage/${hostName}`
// }

export function findMetalColor(paramId) {
  let metalColorArr = getSession("MetalColorCombo") || [];
  let item = metalColorArr.filter((item) => item?.id === paramId);
  return item;
}

export function findMetalType(paramId) {
  let metalTypeArr = getSession("metalTypeCombo") || [];
  let item = metalTypeArr.filter((item) => item?.Metalid == paramId);
  // console.log("findMetal pro",paramId,item);
  return item;
}

export function findMetal(param) {
  let metalTypeArr = getSession("metalTypeCombo") || [];
  let item = metalTypeArr.filter((item) => item?.metaltype === param);
  return item;
}

export function findDiaQcId(param) {
  let diaQCArr = getSession("diamondQualityColorCombo") || [];
  let quality = param.split(",")[0];
  let color = param.split(",")[1];

  let item = diaQCArr?.filter(
    (ele) => ele?.Quality == quality && ele?.color == color
  );
  // console.log("diaa dia",item,param);

  return item;
}

export function findCsQcId(param) {
  let CsQCArr = getSession("ColorStoneQualityColorCombo") || [];
  let quality = param.split(",")[0];
  let color = param.split(",")[1];

  let item = CsQCArr?.filter(
    (ele) => ele?.Quality == quality && ele?.color == color
  );
  // console.log("diaa cs",item,param);
  return item;
}

export const formatter = new Intl.NumberFormat("en-IN")?.format;


export const formatRedirectTitleLine = (titleLine) => {
  // Check for null, undefined, "null", or empty string
  if (!titleLine || titleLine.toLowerCase() == "null" || titleLine === "") {
    return "";
  }
  return titleLine.replace(/\s+/g, "_") + "_";
};

export const formatTitleLine = (titleLine) => {
  if (!titleLine || titleLine.toLowerCase() == "null" || titleLine === "") {
    return "";
  }
  return titleLine;
};

// export const downloadExcelLedgerData = async () => {
//   try {
//     const table = document.getElementById('table-to-xls');
//     if (!table) {
//       setTimeout(() => {
//         const button = document.getElementById('test-table-xls-button');
//         if (button) button.click();
//       }, 500);
//       return;
//     }

//     const excelFile = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table>${table.innerHTML}</table></body></html>`;
//     const blob = new Blob([excelFile], { type: 'application/vnd.ms-excel;charset=utf-8' });
//     const fileName = `AccountLedger_${Date.now()}.xls`;

//     const isMobileDevice = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

//     if (isMobileDevice && navigator.share && navigator.canShare) {
//       try {
//         const file = new File([blob], fileName, { type: 'application/vnd.ms-excel' });
//         if (navigator.canShare({ files: [file] })) {
//           await navigator.share({
//             files: [file],
//             title: 'Account Ledger Excel',
//             text: 'Here is your Account Ledger report.',
//           });
//           return;
//         }
//       } catch (err) {
//         console.log('Share API failed or cancelled, falling back to download:', err);
//       }
//     }

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setTimeout(() => URL.revokeObjectURL(url), 100);

//   } catch (error) {
//     console.error("Download Excel Error:", error);
//     setTimeout(() => {
//       const button = document.getElementById('test-table-xls-button');
//       if (button) button.click();
//     }, 500);
//   }
// }

export const downloadExcelLedgerData = async () => {
  try {
    const table = document.getElementById('table-to-xls');


    if (!table) {

      setTimeout(() => {
        const button = document.getElementById('test-table-xls-button');
        if (button) button.click();
      }, 500);
      return;
    }

    const excelFile = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"></head>
        <body>
          <table>${table.innerHTML}</table>
        </body>
      </html>`;

    const blob = new Blob([excelFile], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    });

    const fileName = `AccountLedger_${Date.now()}.xls`;

    // ✅ MOBILE APP (Flutter WebView)
    if (window.flutter_inappwebview) {

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];


        window.flutter_inappwebview.callHandler(
          "shareExcel",   // 👈 create this handler in Flutter
          base64data,
          fileName
        );
      };

      reader.readAsDataURL(blob);
      return;
    }


    // ✅ WEB DOWNLOAD (Fallback)
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);

  } catch (error) {
    console.error("Download Excel Error:", error);

    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      if (button) button.click();
    }, 500);
  }
};

export const handleScrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

const fetchWithRetry = (url, retries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attemptFetch = (n) => {
      fetch(url)
        .then((response) => response.json())
        .then(resolve)
        .catch((error) => {
          if (n === 0) {
            reject(error)
          } else {
            setTimeout(() => attemptFetch(n - 1), delay);
          }
        });
    };
    attemptFetch(retries);
  });
};

export const fetchAPIUrlFromStoreInit = async () => {
  if (typeof window === "undefined") {
    return null; // or return a default object for SSR
  }
  let getStoreInitData = JSON?.parse(sessionStorage?.getItem("storeInit"));

  if (getStoreInitData?.ApiUrl) {
    return getStoreInitData;
  } else {
    try {
      const path = `${storInitDataPath()}/StoreInit.json`;

      const fetchedData = await fetchWithRetry(path, 3, 200);

      if (fetchedData && !getStoreInitData) {
        sessionStorage.setItem("storeInit", JSON.stringify(fetchedData.rd[0]));
      }

      return fetchedData;
    } catch (error) {
      console.error("Failed to fetch StoreInit.json after 3 retries:", error);
      return null;
    }
  }
};

export const wesbiteDomainName = () => {
  if (typeof window !== "undefined") {
    return window.location.host;
  }
  return "";
};

