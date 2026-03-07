const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Adjust path if necessary based on your folder structure

/**
 * PUBLIC ORDER TRACKING
 */
router.get("/:orderId", async (req, res) => {

  try {
    const { orderId } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required for order tracking" });
    }

    // 1. Fetch the main order details (Now including shipping and discounts)
    const orderResult = await db.query(
      `
      SELECT
        order_id,
        customer_name,
        phone,
        email,
        total_amount,
        shipping_fee,
        discount_amount,
        coupon_code,
        payment_status,
        order_status,
        created_at
      FROM orders
      WHERE order_id = $1 AND email = $2
      `,
      [orderId, email]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    // 2. Fetch the actual items for this order
    const itemsResult = await db.query(
      `
      SELECT product_name, variant_key, price, quantity 
      FROM order_items 
      WHERE order_id = $1
      `,
      [orderId]
    );

    // 3. Attach the items array to the order object
    order.items = itemsResult.rows;

    res.json(order);

  } catch (err) {
    console.error("Order tracking error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

module.exports = router;