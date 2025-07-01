import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/login-by-DA', AuthController.login);

export default router;