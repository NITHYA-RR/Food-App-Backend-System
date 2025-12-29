//Import required pakages
import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

// Import database connection
import { db } from "./src/db/connection.js";

//create app instance
const app = express();

//Middleare to parse
app.use(express.json());

// Test DB connection route
app.get("/db-test", (req, res) => {
    db.query("SELECT DATABASE() AS db", (err, result) => {
        if (err) return res.status(500).send("DB error: " + err.message);
        res.send("Connected to database: " + result[0].db);
    });
});


//Start server
const PORT = process.env.PORT || 50001;
app.listen(PORT, () => {
    console.log(`Server-2 running on port ${PORT}`);
});