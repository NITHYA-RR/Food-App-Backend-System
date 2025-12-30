import express from "express";
import { registerUser,loginUser,syncUserFromServer1 } from "../controllers/userSyncController.js";

const router = express.Router();

// ================= USER ROUTES =================

// Register a new user in this server
// Also triggers user sync to the other server
router.post("/register", registerUser);

// Login API
// Validates email & password using hashed password comparison
router.post("/login", loginUser);

// Sync API
// Called internally by the other server (Server1 → Server2)
// Used only for bi-directional data synchronization
router.post("/sync", syncUserFromServer1);

export default router;