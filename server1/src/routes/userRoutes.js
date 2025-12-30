import express from "express";

import {
    registerUser,
    loginUser,
    syncUserFromServer2
} from "../controllers/userController.js";


const router = express.Router();

// ================= USER ROUTES =================

// Register a new user in this server
// Also triggers user sync to the other server
router.post("/register", registerUser);

// Login API
// Checks email & password using bcrypt comparison
router.post("/login",loginUser);

// Sync API
// Called only by Server2 → Server1 for bi-directional sync
router.post("/sync", syncUserFromServer2);

export default router;