import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issuesService } from "./issues.service";

const createIssues = async(req : Request, res : Response) => {
    try {
        const data = req.user

        const result = await issuesService.createIssueIntoDB({...req.body, data})

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Issue create successfully',
            data: result.rows[0]
        })
    } catch (error : any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error : error
        })
    }
}


export const issuesController = {
    createIssues,
}