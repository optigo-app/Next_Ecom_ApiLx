import { getTenantDb } from "../db/tenantManager.js";
import { getHomeProducts } from "../db/procedures/getHomeProducts.js";
import { saveRecentlyViewed, getRecentlyViewed } from "../db/procedures/recentlyViewed.js";

const db = getTenantDb("localhost");

// Clean up fake test rows
db.prepare("DELETE FROM recently_viewed_designs WHERE customer_id IN ('cust_A', 'cust_B')").run();

// Get actual designs
const products = db.prepare("SELECT designno, autocode, TitleLine, UnitCostWithMarkUp FROM design_Productlist_24_testing_testing_8 LIMIT 5").all();
console.log("Real products in catalog:", products);

if (products.length >= 2) {
  // Save real product 0 for customer 'guest_1001'
  saveRecentlyViewed(db, {
    customerId: "guest_1001",
    designno: products[0].designno,
    autocode: products[0].autocode,
  });

  // Save real product 1 for customer 'guest_1001'
  saveRecentlyViewed(db, {
    customerId: "guest_1001",
    designno: products[1].designno,
    autocode: products[1].autocode,
  });

  // Retrieve recently viewed for guest_1001 when viewing product 1 (should return product 0)
  const recents = getRecentlyViewed(db, {
    customerId: "guest_1001",
    currentDesignno: products[1].designno,
    limit: 6,
    tableName: "design_Productlist_24_testing_testing_8",
  });
  console.log("Recently viewed for guest_1001 (excluding current product):", recents.map(r => ({ designno: r.designno, title: r.TitleLine, price: r.UnitCostWithMarkUp })));
}
