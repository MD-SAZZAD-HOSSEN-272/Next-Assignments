import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config";
import { pool } from "../db";
import sendResponse from "../utility/sendResponse";

export const authVerify = (...roles: string[]) =>async (req: Request,res: Response,next: NextFunction) => {
   
    try {
        const token = req.headers.authorization

          if (!token) {

            sendResponse(res, {
              statusCode: 401,
              success: false,
              message: 'Unauthorized access',

            })
      }

      const decoded = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload;

      if(!roles.includes(decoded.role)){
        sendResponse(res, {
              statusCode: 401,
              success: false,
              message: 'Unauthorized access',

            })
      }


      const userData = await pool.query(
        `
     SELECT * FROM users WHERE email=$1   
        `,
        [decoded.email],
      );

      if (userData.rows.length === 0) {
        sendResponse(res, {
              statusCode: 404,
              success: false,
              message: 'User not found',

            })
      }

      req.user = decoded

      next()

    } catch (error) {
        next(error)
    }
    // next();
  };