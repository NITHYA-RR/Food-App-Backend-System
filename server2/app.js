//Import required pakages
import express from "express";
import dotenv from "dotenv";

//import routes
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productSyncRoutes.js";
dotenv.config();

//create app instance
const app = express();

//Middleare to parse
app.use(express.json());

app.use("/users",userRoutes)
app.use("/products", productRoutes)
app.use("/uploads", express.static("uploads"));

//Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server-2 running on port ${PORT}`);
});