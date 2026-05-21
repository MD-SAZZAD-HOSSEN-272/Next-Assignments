import type { Request, Response } from "express";
import { usersService } from "./users.service";
import sendResponse from "../../utility/sendResponse";

const createUsers = async(req : Request, res : Response) => {
    
    try {
        const result = await usersService.usersCreateIntoDB(req.body)
        
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'user create successfully',
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



export const usersController = {
    createUsers,
}