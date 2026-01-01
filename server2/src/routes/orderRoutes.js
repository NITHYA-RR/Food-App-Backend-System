import express from "express";
import { authMiddleware } from "../../../shared/authMiddleware.js";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders
} from "../controllers/orderController.js";
import { orderSyncController } from "../controllers/orderSyncController.js";

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.post("/", authMiddleware, createOrder);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

// sync
router.post("/sync", orderSyncController);

export default router;