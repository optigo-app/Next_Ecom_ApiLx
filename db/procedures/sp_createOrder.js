/**
 * Stored Procedure: sp_createOrder
 * Atomically creates an order, inserts order items, and updates product inventory
 */
export default function sp_createOrder(db, { orderId, userId, items = [], totalAmount, shippingAddress = {} }) {
    // db.transaction guarantees atomicity (all-or-nothing, automatic rollback on error)
    return db.transaction(() => {
        const insertOrderStmt = db.prepare(`
            INSERT INTO orders (order_id, user_id, total_amount, status, payment_status, shipping_address_json)
            VALUES (?, ?, ?, 'pending', 'pending', ?)
        `);

        const insertItemStmt = db.prepare(`
            INSERT INTO order_items (order_id, product_id, qty, unit_price, total_price, meta_json)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const updateStockStmt = db.prepare(`
            UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?
        `);

        // 1. Insert main order record
        insertOrderStmt.run(orderId, userId, totalAmount, JSON.stringify(shippingAddress));

        // 2. Process all order items
        for (const item of items) {
            const itemTotal = (item.unitPrice || 0) * (item.qty || 1);
            insertItemStmt.run(
                orderId,
                item.productId,
                item.qty || 1,
                item.unitPrice || 0,
                itemTotal,
                JSON.stringify(item.meta || {})
            );

            // 3. Deduct stock safely
            updateStockStmt.run(item.qty || 1, item.productId, item.qty || 1);
        }

        return {
            success: true,
            orderId,
            message: "Order placed successfully",
        };
    })();
}
