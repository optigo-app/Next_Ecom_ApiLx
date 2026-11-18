import {
  getCompanyInfoData,
  getExtraFlag,
  getStoreInit,
} from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import React, { Suspense } from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import ProCatFooter from "./components/ProCatFooter";
import BackToTop from "@/app/components/(static)/Footer/procat/BackToTop";
import ChatMenu from "@/app/components/(static)/ChatMenu/ChatMenu";
import { cookies } from "next/headers";
import { getSqliteMenus } from "@/app/(core)/utils/sqlite/sqliteActions";
import ProCatNewHeader from "@/app/components/(dynamic)/Header/Procat/ProCatNewHeader";
import { getFooterLinks } from "@/app/(core)/utils/footerMenuConfig";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import ProcatLayoutFrame from "./ProcatLayoutFrame";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();
  let extraFlag = await getExtraFlag();
  const { hostname } = await getDomainInfo();
  const footerList = await getFooterLinks(hostname);

  let parsedSocialLinks = [];
  try {
    const rawSocial = companyInfoData?.SocialLinkObj;
    parsedSocialLinks =
      rawSocial && rawSocial !== "undefined" && rawSocial !== "null"
        ? JSON.parse(rawSocial)
        : [];
  } catch (err) {
    console.warn("Invalid SocialLinkObj JSON:", err);
    parsedSocialLinks = [];
  }

  const cookieStore = await cookies();
  const userPkgIdCookie = cookieStore.get("userPackageId")?.value;
  const activePackageId = userPkgIdCookie ? Number(userPkgIdCookie) : storeData?.PackageId;

  let initialMenuData = [];
  try {
    const menuRes = await getSqliteMenus({ packageId: activePackageId });
    initialMenuData = menuRes?.Data?.rd || [];
  } catch (err) {
    console.warn("[beluxjewel layout] SSR menu pre-fetch failed:", err.message);
  }

  return (
    <Suspense fallback={children}>
      <ProcatLayoutFrame
        header={<ProCatNewHeader storeinit={storeData} logos={logos} />}
        footer={
          <ProCatFooter
            list={footerList}
            companyInfoData={companyInfoData}
            socialMediaData={parsedSocialLinks}
          />
        }
        backToTop={<BackToTop />}
        chatMenu={<ChatMenu />}
      >
        {children}
      </ProcatLayoutFrame>
    </Suspense>
  );
};

export default layout;
