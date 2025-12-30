import { db } from "../db/connection.js";
import bcrypt from "bcrypt";
import axios from "axios";
import {
  hashPassword,
  comparePassword,
  syncUserToServer,
  generateToken
} from "../../../shared/userHelpers.js";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    //Extract user input from request body
    const { name, email, phone, password } = req.body;
    
    //Basic validation to avoid empty user records
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // check whether the user already exists to prevent duplicates registrations
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    //passed hasing is handled via shared helper
    //bcrypt is injected from controller to keep helpers reusable
    const hashed = await hashPassword(bcrypt, password);

    // store user data securely in server1 database
    await db.execute(
      "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)",
      [name, email, phone, hashed]
    );

    //sync newly registered user to server2 for bi-directional consistency
    //axios is passed from controller to avoid direct depedency in shared helpers 
    await syncUserToServer(
      axios,
      { name, email, phone, password: hashed },
      "http://localhost:5001"
    );


    //Successfully registration responce
    res.status(201).json({ message: "User registered successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB Error" });
  }
};


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    //extract login credentials from request
    const { email, password } = req.body;

    //fetch user details using email
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    //If no user found ,return 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // password verification handled via shared helper
    //bcrypt is injected from controller to keep helpers decoupled
    const isMatch = await comparePassword(
      bcrypt,
      password,
      user.password
    );

    //reject login if password does not match
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

     // Generate JWT
    
    const token = generateToken({ 
        id: user.user_id, 
        name: user.name, 
        email: user.email },
        process.env.JWT_SECRET, "1h");
    
    //successfully authentication responce
    //sensitive fields like password are intentionally excluded
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email
      }, token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB Error" });
  }
};

// ================= SYNC FROM SERVER2 =================
// This API is triggered by Server2 to keep user data consistent across both servers
export const syncUserFromServer2 = async (req, res) => {
  try {
    // Receive already-validated and hashed user data from Server2
    const { name, email, phone, password } = req.body;

    // Check if the user already exists to avoid duplicate records
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    // If user exists, skip insertion (idempotent sync behavior)
    if (existing.length > 0) {
      return res.status(200).json({ message: "User already synced" });
    }

    // Password is already hashed on Server2
    // Re-hashing is intentionally avoided to preserve authentication integrity
    await db.execute(
      "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)",
      [name, email, phone, password]
    );

    console.log("User synced FROM Server2 → Server1");

    // Successful sync acknowledgment
    res.status(201).json({ message: "User synced successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Sync failed" });
  }
};





