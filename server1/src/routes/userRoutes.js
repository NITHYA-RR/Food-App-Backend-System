import express from "express";

import {
    registerUser,
    loginUser,
    syncUserFromServer2
} from "../controllers/userController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.post("/sync", syncUserFromServer2);

export default router;