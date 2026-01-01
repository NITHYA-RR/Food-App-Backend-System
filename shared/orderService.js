import { syncOrder } from "./orderSyncHelper.js";

export const createOrderService = async (db, data, targetServer) => {
  const { order_id, user_id, product_id, quantity, total_price, status } = data;

  await db.execute(
    `INSERT INTO orders 
     (order_id, user_id, product_id, quantity, total_price, status)
     VALUES (?,?,?,?,?,?)`,
    [order_id, user_id, product_id, quantity, total_price, status]
  );

  await syncOrder(targetServer, data);
};

export const updateOrderService = async (db, order_id, data, targetServer) => {
  await db.execute(
    `UPDATE orders SET quantity=?, total_price=?, status=? WHERE order_id=?`,
    [data.quantity, data.total_price, data.status, order_id]
  );

  await syncOrder(targetServer, { order_id, ...data });
};

export const deleteOrderService = async (db, order_id, targetServer) => {
  await db.execute(`DELETE FROM orders WHERE order_id=?`, [order_id]);

  await syncOrder(targetServer, { order_id, deleted: true });
};

export const getOrdersService = async (db, user_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM orders WHERE user_id=?",
    [user_id]
  );
  return rows;
};