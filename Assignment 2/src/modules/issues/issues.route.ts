import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authVerify } from "../../middleware/auth";

const route = Router()

route.post('/', authVerify('contributor', 'maintainer'), issuesController.createIssues)
route.get('/', issuesController.getAllIssues)
route.get('/:id', issuesController.getIssuesById)
route.patch('/:id', authVerify('contributor', 'maintainer'), issuesController.updateIssuesById)
route.delete('/:id', authVerify('maintainer'), issuesController.deleteIssueById)

export const issuesRoute = route