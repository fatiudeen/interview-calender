import { body, param } from 'express-validator';

export default {
  id: [param('id').notEmpty().withMessage('id field is required')],
  create: [
    body('candidate').optional(),
    body('interviewers')
      .optional()
      .isArray()
      .withMessage('interviewers has to be an array'),
  ],
};
