//Import required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js"


//configure environment variables
dotenv.config();

//Create app instance
const app = express();

//Middleware to parse
app.use(cors());
app.use(express.json());

//Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes)
app.use('/orders' , orderRoutes)

//start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server-1 is running on port http://localhost:${PORT}`);
});