import { getSession } from "@/app/(core)/utils/FetchSessionData";

function getMasterOptions() {
  try {
    const raw = getSession("B2BRegisterMasterApi");
    if (!raw) return {};
    const allItems = Object?.values(raw)?.flat();
    const grouped = allItems?.reduce((acc, item) => {
      const { MasterName, ...rest } = item;
      if (!MasterName) return acc;

      if (!acc[MasterName]) {
        acc[MasterName] = { options: [] };
      }
      acc[MasterName]?.options.push(rest);

      return acc;
    }, {});
    return grouped;
  } catch (err) {
    console.error("Failed to normalize B2BRegisterMasterApi:", err);
    return {};
  }
}

export default getMasterOptions;


