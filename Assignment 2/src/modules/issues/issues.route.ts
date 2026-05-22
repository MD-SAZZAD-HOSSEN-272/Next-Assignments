import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authVerify } from "../../middleware/auth";

const route = Router()

route.post('/', authVerify('contributor', 'maintainer'), issuesController.createIssues)
route.get('/', issuesController.getAllIssues)

export const issuesRoute = route