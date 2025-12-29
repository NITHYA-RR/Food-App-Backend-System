import bcrypt from "bcrypt";
import axios from "axios";
import { db } from "../db/connection.js";


//User register
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    // check user exists
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert into Server 1 DB
    await db.execute(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    // 🔁 SYNC TO SERVER 2
    await axios.post("http://localhost:5001/users/sync", {
      name,
      email,
      phone,
      password: hashedPassword,
      source:"server1"   
     });

    console.log("User synced to Server 2");

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB Error" });
  }
};



//User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //check if user exists
    const [data] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = data[0];
    
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //login success
    res.status(200).json({
      message: "Login successfully",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB Error" });
  }
};

//Create a sync controller in Server
export const syncUserFromServer2 = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // check if user already exists
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(200).json({ message: "User already synced" });
    }

    // password is already hashed ❗
    await db.execute(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, password]
    );

    console.log("✅ User synced FROM Server 2 → Server 1");

    res.status(201).json({ message: "User synced successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Sync failed" });
  }
};


