import { db } from "../db/connection.js";

export const orderSyncController = async (req, res) => {
  const { order_id, deleted } = req.body;

  if (deleted) {
    await db.execute("DELETE FROM orders WHERE order_id=?", [order_id]);
    return res.json({ message: "Order deleted via sync" });
  }

  const [exists] = await db.execute(
    "SELECT order_id FROM orders WHERE order_id=?",
    [order_id]
  );

  if (exists.length === 0) {
    await db.execute(
      `INSERT INTO orders 
       (order_id, user_id, product_id, quantity, total_price, status)
       VALUES (?,?,?,?,?,?)`,
      [
        req.body.order_id,
        req.body.user_id,
        req.body.product_id,
        req.body.quantity,
        req.body.total_price,
        req.body.status
      ]
    );
  } else {
    await db.execute(
      `UPDATE orders SET quantity=?, total_price=?, status=? WHERE order_id=?`,
      [
        req.body.quantity,
        req.body.total_price,
        req.body.status,
        order_id
      ]
    );
  }

  res.json({ message: "Order synced" });
};