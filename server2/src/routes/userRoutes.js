import express from "express";
import { registerUser,loginUser,syncUser } from "../controllers/userSyncController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sync", syncUser);

export default router;