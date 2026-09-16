import { getTenantDb } from "../db/tenantManager.js";
import { saveRecentlyViewed, getRecentlyViewed } from "../db/procedures/recentlyViewed.js";

const db = getTenantDb("localhost");

console.log("--- Testing Recently Viewed Functionality ---");

// Test 1: Customer A views design 'B101'
const saveA1 = saveRecentlyViewed(db, {
  customerId: "cust_A",
  designno: "B101",
  autocode: "AC101"
});
console.log("Customer A viewed B101:", saveA1);

// Test 2: Customer B views the SAME design 'B101' (proving designno is NOT unique across users)
const saveB1 = saveRecentlyViewed(db, {
  customerId: "cust_B",
  designno: "B101",
  autocode: "AC101"
});
console.log("Customer B viewed SAME B101:", saveB1);

// Test 3: Customer A views design 'B102'
const saveA2 = saveRecentlyViewed(db, {
  customerId: "cust_A",
  designno: "B102",
  autocode: "AC102"
});
console.log("Customer A viewed B102:", saveA2);

// Check raw database rows in recently_viewed_designs
const allRows = db.prepare("SELECT * FROM recently_viewed_designs ORDER BY id ASC").all();
console.log("\nAll rows in recently_viewed_designs table:");
console.table(allRows);

// Verify that both Customer A and Customer B have B101 recorded
const b101Rows = db.prepare("SELECT * FROM recently_viewed_designs WHERE designno = 'B101'").all();
console.log(`\nRows for designno 'B101': count = ${b101Rows.length}`);
if (b101Rows.length >= 2) {
  console.log("SUCCESS: designno is NOT unique. Multiple customers successfully clicked/opened the same design!");
} else {
  console.error("FAILURE: designno appears constrained!");
}

// Verify customer isolation
const custARecents = db.prepare("SELECT * FROM recently_viewed_designs WHERE customer_id = 'cust_A' ORDER BY updated_at DESC").all();
console.log(`Customer A recents: ${custARecents.map(r => r.designno).join(", ")}`);

const custBRecents = db.prepare("SELECT * FROM recently_viewed_designs WHERE customer_id = 'cust_B' ORDER BY updated_at DESC").all();
console.log(`Customer B recents: ${custBRecents.map(r => r.designno).join(", ")}`);

console.log("\n--- Verification Complete ---");
