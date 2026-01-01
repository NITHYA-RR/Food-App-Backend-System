import { db } from "../db/connection.js";
import {
    createOrderService,
    updateOrderService,
    deleteOrderService,
    getOrdersService
} from "../../../shared/orderService.js";

const TARGET_SERVER =
    process.env.PORT === "5000"
        ? "http://localhost:5001"
        : "http://localhost:5000";

export const createOrder = async (req, res) => {
    try {
        await createOrderService(db, req.body, TARGET_SERVER);
        res.json({ message: "Order created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateOrder = async (req, res) => {
    await updateOrderService(
        db,
        req.params.id,
        req.body,
        TARGET_SERVER
    );
    res.json({ message: "Order updated" });
};

export const deleteOrder = async (req, res) => {
    await deleteOrderService(
        db,
        req.params.id,
        TARGET_SERVER
    );
    res.json({ message: "Order deleted" });
};

export const getOrders = async (req, res) => {
    console.log(req)

    const { id } = req.params
    const orders = await getOrdersService(db, id);
    res.json(orders);
};