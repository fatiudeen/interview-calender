import { Request, Response } from 'express';
import { DOCS } from '@config';

const docs = (req: Request, res: Response) => {
  res.redirect(DOCS);
};

export default docs;
