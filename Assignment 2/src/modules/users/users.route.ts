import { Router } from "express";
import { usersController } from "./users.controller";

const route = Router()

route.post('/signup', usersController.createUsers)

export const userRoute = route