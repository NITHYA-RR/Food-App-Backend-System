import express from "express";
import { authMiddleware } from "../../../shared/authMiddleware.js";
import { orderSyncController } from "../controllers/orderSyncController.js";
import { createOrder, deleteOrder, getOrders, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/:id", authMiddleware, getOrders);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

// sync
router.post("/sync", orderSyncController);

export default router;