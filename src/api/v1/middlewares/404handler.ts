import { Request, Response } from 'express';

const error404 = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not Found',
  });
};

export default error404;
