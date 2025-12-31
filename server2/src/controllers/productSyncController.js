import { db } from "../db/connection.js";
import { upload } from "../../../shared/upload.js";
import {
    createProductsService,
    getProductsService,
    updateProductsService,
    deleteProductsService
} from "../../../shared/productService.js";

// Target server for bi-directional sync
const TARGET_SERVER = "http://localhost:5000"; // On Server1

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
         if (req.file) {
            productData.image = req.file.filename;
        }
        await createProductsService(db, req.body, TARGET_SERVER);
        res.status(201).json({ message: "Product created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET PRODUCTS (protected route, only for authenticated users)
export const getProducts = async (req, res) => {
    try {
        const products = await getProductsService(db);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    const productData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
      image: req.file ? req.file.filename : req.body.image // old image fallback
    };

    await updateProductsService(
      db,
      req.params.id,
      productData,
      TARGET_SERVER
    );

    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        await deleteProductsService(db, req.params.id, TARGET_SERVER);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};