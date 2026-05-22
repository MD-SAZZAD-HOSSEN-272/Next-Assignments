import type { NextFunction, Request, Response } from "express";

const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.error(err.stack);

  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error : err,
    forTest : 'sazzad'
  });
};

export default globalError;