import React, { Suspense } from "react";
import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { pages } from "@/app/(core)/utils/pages";
import { Box } from "@mui/material";
import TopSection from "@/app/components/(static)/HeroSection/HeroSection";


// import useHomeBannerImages from "@/app/(core)/utils/Glob_Functions/ThemesBanner/ThemesBanner";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import BrandInfoMarquee from "./blocks/Marquee";
import CategoryBlock from "./blocks/Category";
import CollectionBlock from "./blocks/Collection";

import MaxBestSeller from "./blocks/MaxBestSeller";
import MaxNewArrival from "./blocks/MaxNewArrival";
// import MaxAlbum from "./blocks/MaxAlbum";
import MaxTrendingView from "./blocks/MaxTrending";
// import MaxDesignSet from "./blocks/MaxDesignSet";
import MaxBrandMarquee from "./blocks/MaxBrandMarquee";
import MaxPhysicalStore from "./blocks/MaxPhysicalStore";
// import MaxNewsletter from "./blocks/MaxNewsletter";
import SocialMediaVideoSection from "./blocks/SocialMedia";
import MaxDesignLibrary from "./blocks/MaxDesignLibrary";
import { getSqliteHomeBestseller, getSqliteHomeNewArrival, getSqliteHomeTrending } from "@/app/(core)/utils/sqlite/sqliteActions";
import { getWebContentManagement } from "@/app/(core)/hooks/webContentManagement/webContentManagement.server";
import SocialMedia from "@/app/components/(static)/SocialMedia/SocialMedia";
import B2BContent from "@/app/components/(dynamic)/B2BContent";
import { cookies } from "next/headers";
import { isB2BWebsite } from "@/app/(core)/utils/isB2B";
import { isHomeSectionEnabled } from "@/app/(core)/utils/storeFlags";
import PhysicalStore from "@/app/components/(static)/PhysicalStore/PhysicalStore";
import ExhibitionConfig from "@/app/components/(static)/ExhibitionConfig/ExhibitionConfig";
import CraftsmanshipPage from "@/app/components/(static)/CraftsmanshipPage/CraftsmanshipPage";
import DesignLibrary from "@/app/components/(static)/DesignLibrary/DesignLibrary";



export const metadata = generatePageMetadata(pages["/"], "Belux Jewel");

const BeluxJewelHome = async () => {
  const storeData = await getStoreInit();
  const cookieStore = await cookies();
  const showBestSeller = isHomeSectionEnabled(storeData, "bestSeller");
  const showNewArrival = isHomeSectionEnabled(storeData, "newArrival");
  const showTrending = isHomeSectionEnabled(storeData, "trending");
  const canViewB2BContent =
    !isB2BWebsite(storeData) || Boolean(cookieStore.get("userLoginCookie")?.value);

  const [bestsellerRes, newArrivalRes, trendingRes, webContentRes] =
    await Promise.all([
      canViewB2BContent && showBestSeller
        ? getSqliteHomeBestseller({}, storeData?.domain).catch(() => null)
        : null,
      canViewB2BContent && showNewArrival
        ? getSqliteHomeNewArrival({}, storeData?.domain).catch(() => null)
        : null,
      canViewB2BContent && showTrending
        ? getSqliteHomeTrending({}, storeData?.domain).catch(() => null)
        : null,
      getWebContentManagement({ domain: storeData?.domain }),
    ]);

  const initialBestSellers = bestsellerRes?.rd || [];
  const initialNewArrivals = newArrivalRes?.rd || [];
  const initialTrending = trendingRes?.rd || [];

  const {
    pageTemplates,
    sequenceconfig,
    raw: initialWebsiteContent,
    categoryConfig: initialCategoryConfig,
    categories: initialCategories,
    collectionConfig: initialCollectionConfig,
    collections: initialCollections,
  } = webContentRes;

  const socialMediaTemplates = (pageTemplates || []).filter(
    (t) => t?.PageKey === "social-media"
  );
 
  

 
  /* ---------- section registry: sequenceconfig key -> component ---------- */
  const sectionRenderers = {
    marquee: () => <BrandInfoMarquee assetBase={assetBase} />,

    categories: () => (
      <B2BContent>
        <CategoryBlock
          assetBase={assetBase}
          storeInit={storeData}
          initialData={initialWebsiteContent}
          initialCategoryConfig={initialCategoryConfig}
          initialCategories={initialCategories}
        />
      </B2BContent>
    ),

    collections: () => (
      <B2BContent>
        <CollectionBlock
          assetBase={assetBase}
          storeInit={storeData}
          initialData={initialWebsiteContent}
          initialCollectionConfig={initialCollectionConfig}
          initialCollections={initialCollections}
        />
      </B2BContent>
    ),

    exhibition: () => <ExhibitionConfig />,
    socialMedia: () => <SocialMedia templates={socialMediaTemplates} />,
    craftsmanship: () => <CraftsmanshipPage />,
    showroom: () => <PhysicalStore />,
    designLibrary: () => <DesignLibrary />,

    // optional: only show if you add these keys to sequenceconfig
    bestSeller: () =>
      showBestSeller ? (
        <B2BContent>
          <MaxBestSeller storeInit={storeData} initialData={initialBestSellers} />
        </B2BContent>
      ) : null,
    newArrival: () =>
      showNewArrival ? (
        <B2BContent>
          <MaxNewArrival storeInit={storeData} initialData={initialNewArrivals} />
        </B2BContent>
      ) : null,
    trending: () =>
      showTrending ? (
        <B2BContent>
          <MaxTrendingView storeInit={storeData} initialData={initialTrending} />
        </B2BContent>
      ) : null,
  };

  
  const sectionList = Array.isArray(sequenceconfig?.sections)
    ? sequenceconfig.sections
    : Array.isArray(sequenceconfig)
    ? sequenceconfig
    : [];

  const orderedSections = [...sectionList].sort(
    (a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)
  );


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        mt: { xs: "-64px", sm: "-84px" },
      }}
    >
      <TopSection />

      {orderedSections.map(({ key }) => {
        const render = sectionRenderers[key];
        return render ? <React.Fragment key={key}>{render()}</React.Fragment> : null;
      })}
    </Box>
  );
};

export default BeluxJewelHome;
