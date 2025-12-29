//Import required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";

//configure environment variables
dotenv.config();

//Create app instance
const app = express();

//Middleware to parse
app.use(cors());
app.use(express.json());

//Routes
app.use("/users", userRoutes);

//start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server-1 is running on port ${PORT}......!`);
});