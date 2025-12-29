import bcrypt from "bcrypt";
import axios from "axios";
import {db} from "../db/connection.js";

export const syncUser = async(req, res) => {
    try {
        const {name , email, phone, password } = req.body;

        //Hash password 
        const hashedpassword = await bcrypt.hash(password, 10);

        //save in server2 DB
        await db.execute(
            "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)",
            [name, email, phone, hashedpassword]
        );

        //sync to server1
        await axios.post("http://localhost:5000/users/sync",{
            name,email,phone,password:hashedpassword
        });

        console.log("User synced to server1");

        res.json({
            message:"User registered successfully"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "registration failed"
        });
    }
};