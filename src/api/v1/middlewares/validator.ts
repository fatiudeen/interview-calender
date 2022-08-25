import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import HttpError from '@helpers/HttpError';

const validator = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array();
    throw new HttpError('user input validation error', 400, error);
  }
  next();
};

export default validator;
