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


const getAllIssues = async(req : Request, res : Response) => {
        try {
        const data = req.query

        const result = await issuesService.getAllIssuesFromDB(data)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Issues retrived successfully',
            data: result
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


const getIssuesById = async(req : Request, res : Response) => {
        try {
        const {id} = req.params

        if (!id || Array.isArray(id)) {
        throw new Error("Invalid ID");
        }

        const result = await issuesService.getSingleIssue(id)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Issues retrived successfully',
            data: result
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


const updateIssuesById = async(req : Request, res : Response) => {
    try {
        const decoded = req.user
        const {id} = req.params

        if (!id || Array.isArray(id)) {
        throw new Error("Invalid ID");
        }

        const updateData = req.body;

        if (!decoded) {
        throw new Error("Unauthorized");
        }

        const result = await issuesService.updateIssue(decoded, id, updateData)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Issue updated successfully',
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

const deleteIssueById = async(req : Request, res : Response) => {
    try {
        const {id} = req.params

        if (!id || Array.isArray(id)) {
        throw new Error("Invalid ID");
        }

        const result = await issuesService.deleteIssueFromDB(id)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Issue Deleted successfully',
            data: result
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
    getAllIssues,
    getIssuesById,
    updateIssuesById,
    deleteIssueById
}