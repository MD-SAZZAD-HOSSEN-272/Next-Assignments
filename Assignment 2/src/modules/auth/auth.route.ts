import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

route.post('/login', authController.signInUser)

export const authRouter = route