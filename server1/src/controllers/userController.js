import bcrypt from "bcrypt";
import { db } from "../db/connection.js";


//User register
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    // check user exists
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert user
    await db.execute(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

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


// Get user by id
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const [data] = await db.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (data.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "DB Error"
    });
  }
};

