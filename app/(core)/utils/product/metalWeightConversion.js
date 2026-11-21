function normalizeMetalName(name) {
  return String(name ?? "").trim().toLowerCase();
}

function findDensity(metalDensities, metalType) {
  const target = normalizeMetalName(metalType);
  if (!target || !Array.isArray(metalDensities)) return 0;

  const row = metalDensities.find((item) =>
    normalizeMetalName(item?.gold_type ?? item?.MasterManagement_goldtypename) === target,
  );
  const density = Number(row?.density);
  return Number.isFinite(density) && density > 0 ? density : 0;
}

/**
 * Converts net weight between metal types using the ERP density rule.
 * If either density is unavailable, this matches the ERP function's fallback
 * and returns the original weight. The result is rounded to three decimals.
 */
export function convertNetWeightByMetal({
  fromMetalType,
  fromWeight,
  toMetalType,
  metalDensities,
}) {
  const weight = Number(fromWeight);
  if (!Number.isFinite(weight)) return 0;

  const fromDensity = findDensity(metalDensities, fromMetalType);
  const toDensity = findDensity(metalDensities, toMetalType);
  if (!fromDensity || !toDensity) return Number(weight.toFixed(3));

  return Number(((weight * fromDensity) / toDensity).toFixed(3));
}

export default convertNetWeightByMetal;
