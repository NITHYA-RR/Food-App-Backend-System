import dotenv from "dotenv";
import mysql from "mysql2/promise";


dotenv.config();

//create connection
export const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// connect to database
db.connect((err) => {
    if(err){
        console.error("Database connection failed: ", err.message);
    }else{
        console.log("Connected to Server-2 database successfully!");

    }
});

