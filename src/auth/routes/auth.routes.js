import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/login-by-DA', AuthController.loginByDA);
router.post('/login-by-buk', AuthController.loginByBuk);

export default router;