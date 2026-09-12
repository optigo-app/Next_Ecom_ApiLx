import { getTenantDb } from "./tenantManager.js";
import { getDesigns } from "./procedures/getDesignsByMenu.js";

const db = getTenantDb("beluxjewel.web");

console.log("=== 1. SQL Direct ===");
const q1 = db.prepare("SELECT count(*) as count FROM designs WHERE gender = 'Women' COLLATE NOCASE AND category = 'Pendant Set' COLLATE NOCASE").get();
console.log("Women + Pendant Set count:", q1);

const q2 = db.prepare("SELECT count(*) as count FROM designs WHERE collection = 'PH COLLECTIONS' COLLATE NOCASE").get();
console.log("PH COLLECTIONS count:", q2);

const q3 = db.prepare("SELECT count(*) as count FROM designs WHERE brand = 'Jewellery' COLLATE NOCASE AND gender = 'Women' COLLATE NOCASE").get();
console.log("Jewellery + Women count:", q3);

console.log("\n=== 2. Using getDesigns ===");
console.log("Test Payload 1 (FilterKey1/FilterVal1 + FilterKey2/FilterVal2):");
const res1 = getDesigns(db, {
    FilterKey: "Auto",
    FilterVal: "",
    FilterKey1: "gender",
    FilterVal1: "Women",
    FilterKey2: "category",
    FilterVal2: "Pendant Set",
    PageNo: 1,
    PageSize: 10
});
console.log("Total Count:", res1.totalCount, "Rows Returned:", res1.rd.length);

console.log("\nTest Payload 2 (FilterKey1=collection):");
const res2 = getDesigns(db, {
    FilterKey: "Auto",
    FilterVal: "",
    FilterKey1: "collection",
    FilterVal1: "PH COLLECTIONS",
    PageNo: 1,
    PageSize: 10
});
console.log("Total Count:", res2.totalCount, "Rows Returned:", res2.rd.length);

console.log("\nTest Payload 3 (FilterKey=brand, FilterKey1=gender):");
const res3 = getDesigns(db, {
    FilterKey: "brand",
    FilterVal: "Jewellery",
    FilterKey1: "gender",
    FilterVal1: "Women",
    PageNo: 1,
    PageSize: 10
});
console.log("Total Count:", res3.totalCount, "Rows Returned:", res3.rd.length);

console.log("\nTest Payload 4 (Direct category & gender, SortBy Price):");
const res4 = getDesigns(db, {
    category: "Ring",
    gender: "Women",
    SortBy: "Price Low to High",
    PageNo: 1,
    PageSize: 5
});
console.log("Total Rings (Women):", res4.totalCount, "Rows Returned:", res4.rd.length);
if (res4.rd.length > 0) {
    console.log("First Ring Price:", res4.rd[0].UnitCostWithMarkUpIncTax);
}

console.log("\nTest Payload 5 (Price Object FilPrice):");
const res5 = getDesigns(db, {
    FilPrice: { Minval: 100, Maxval: 100000 },
    PageNo: 1,
    PageSize: 5
});
console.log("Total in Price Range:", res5.totalCount);
