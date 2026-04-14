import express from "express";
import { signUp, login, googleLogin } from "../controllers/auth.js";
import * as z from "zod";
import validate from "../middlewares/validation.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const googleSchema = z.object({
  idToken: z.string(),
});

router.post("/signup", validate(signUpSchema), signUp);
router.post("/login", validate(loginSchema), login);
router.post("/google-login", validate(googleSchema), googleLogin);

export default router;
