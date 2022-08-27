/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import HttpError from '@helpers/HttpError';

const errorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = { ...err };

  error.message = err.message;

  let statusCode: number;
  if ('statusCode' in error) {
    statusCode = error.statusCode;
  } else {
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    error,
  });
};

// eslint-disable-next-line import/prefer-default-export
export { errorHandler };
