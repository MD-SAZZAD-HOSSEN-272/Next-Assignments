import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authVerify } from "../../middleware/auth";

const route = Router()

route.post('/', authVerify('admin', 'user'), issuesController.createIssues)

export const issuesRoute = route