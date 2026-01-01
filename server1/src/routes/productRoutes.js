import express from "express";
import { upload } from "../../../shared/upload.js";
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

import { authMiddleware } from "../../../shared/authMiddleware.js";
import { db } from "../db/connection.js";
import {
    createProductsService,
    deleteProductsService,
    updateProductsService
} from "../../../shared/productService.js";

const router = express.Router();
router.get("/:id", authMiddleware, getProducts);

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),   // ⭐ MUST
    updateProduct
);


// ================== SERVER-TO-SERVER SYNC ==================
router.post("/sync", async (req, res) => {
    try {
        const { product_id, name, price, description, image, stock, action } = req.body;

        if (action === "delete") {
            await deleteProductsService(db, product_id); // only DB delete
        } else {
            await updateProductsService(db, product_id, { name, price, description, image, stock, action }, "http://localhost:5000")

        }

        res.status(201).json({ message: "Product synced successfully" });
    } catch (err) {
        console.log("Product sync error:", err.message);
        res.status(500).json({ message: "Sync failed2" });
    }
});

// ================== USER CRUD ==================
router.post("/", authMiddleware, upload.single("image"), createProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;

