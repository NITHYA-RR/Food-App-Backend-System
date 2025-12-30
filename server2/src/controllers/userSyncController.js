import bcrypt from "bcrypt";
import axios from "axios";
import {db} from "../db/connection.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save in server2 DB
    await db.execute(
      "INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)",
      [name, email, phone, hashedPassword]
    );

    // sync to server1
    await axios.post("http://localhost:5000/users/sync", {
      name,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully (Server2)"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Registration failed"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user in server2 DB
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.status(200).json({
      message: "Login successful (Server2)",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Login failed"
    });
  }
};

export const syncUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    await db.execute(
      "INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)",
      [name, email, phone, password]
    );

    console.log("User synced from Server1");

    res.json({
      message: "User synced successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Sync failed"
    });
  }
};
