import express from "express";
import { upload } from "../../../shared/upload.js";
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productSyncController.js";

import { authMiddleware } from "../../../shared/authMiddleware.js";
import { db } from "../db/connection.js";
import {
    createProductsService,
    deleteProductsService
} from "../../../shared/productService.js";

const router = express.Router();

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),  
  updateProduct
);



// ================== SERVER-TO-SERVER SYNC ==================
router.post("/sync", async (req, res) => {
    try {
        const { product_id, name, price, description, image, stock,action} = req.body;

        if (action === "delete") {
            await deleteProductsService(db, product_id); // only DB delete
        } else {
            await createProductsService(db, { name, price, description, image, stock,action }, ""); // no further sync
        }

        res.status(201).json({ message: "Product synced successfully" });
    } catch (err) {
        console.log("Product sync error:", err.message);
        res.status(500).json({ message: "Sync failedssss" });
    }
});

// ================== USER CRUD ==================
router.post("/", authMiddleware, upload.single("image"), createProduct);
router.put("/", authMiddleware, upload.single("image"), updateProduct);
router.get("/", authMiddleware, getProducts);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
