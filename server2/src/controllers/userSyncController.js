import { db } from "../db/connection.js";
import bcrypt from "bcrypt";
import axios from "axios";
import {
     hashPassword, 
     comparePassword, 
     syncUserToServer,
     generateToken
     } 
     from "../../../shared/userHelpers.js";

// ================= USER REGISTER (SERVER2) =================
// Handles user registration in Server2 and syncs the same user to Server1
export const registerUser = async (req, res) => {
  try {

    // Extract user input from request body
    const { name, email, phone, password } = req.body;

    // Hash password before storing
    // bcrypt is injected to avoid duplicate logic across servers
    const hashed = await hashPassword(bcrypt, password);

    // Store user details in Server2 database
    await db.execute(
      "INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)",
      [name, email, phone, hashed]
    );

    // Sync the already-hashed user data to Server1
    // This avoids re-hashing and keeps credentials consistent
    await syncUserToServer(
      axios,
      { name, email, phone, password: hashed },
      "http://localhost:5000"
    );
   
    // Registration success response
    res.status(201).json({ message: "User registered successfully (Server2)"});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User already exists" });
  }
};



// ================= USER LOGIN (SERVER2) =================
// This API validates user credentials and allows login
export const loginUser = async (req, res) => {
  try {

    // Get email and password entered by the user
    const { email, password } = req.body;

     // Check whether the user exists in Server2 database
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    // If no user found, return 404
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    // Compare entered password with stored hashed password
    // bcrypt is injected via helper to avoid duplicate logic
    const isMatch = await comparePassword(
      bcrypt,
      password,
      rows[0].password
    );

    const user = rows[0];
    // If password does not match, return unauthorized error
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

     // Generate JWT
     
    const token = generateToken({ 
        id: user.user_id, 
        name: user.name, 
        email: user.email },
        process.env.JWT_SECRET, "1h");
    
    // Login success – send minimal user details (no password)
    res.json({
      message: "Login successful",
      user: {
        id: rows[0].user_id,
        name: rows[0].name,
        email: rows[0].email
      },token
    });

  } catch (err) {

    // Handle unexpected errors (DB / server issues)
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
};





// ================= USER SYNC API =================
// This API is called by Server1 to sync user data into Server2
export const syncUserFromServer1 = async(req,res) => {
  try {

    // Receive user data sent from Server1
    // NOTE: Password is already hashed in Server1
    const { name,email,phone,password } = req.body;

    // Check whether the user already exists in Server2 DB
    const [existing] = await db.execute("SELECT * FROM users WHERE email=?", [email]);

    // If user already exists, skip insert to avoid duplication
    if (existing.length > 0) return res.status(200).json({ message:"User already synced" });


    // Insert user into Server2 database
    await db.execute("INSERT INTO users (name,email,phone,password) VALUES (?,?,?,?)", [name,email,phone,password]);
    
    // Log for backend tracking
    console.log("User synced FROM Server1 → Server2");

    // Send success response back to Server1
    res.status(201).json({ message:"User synced successfully" });
  } catch(err) {

    // Handle any DB or server-level errors
    console.log("User Sync Error (Server2) :",err);
    res.status(500).json({ message:"Sync failed" });
  }
};


