import express from "express";
import { syncUser } from "../controllers/userSyncController.js";

const router = express.Router();

router.post("/sync", syncUser);

export default router;