import { body, param } from 'express-validator';

export default {
  id: [param('id').notEmpty().withMessage('id field is required')],
  create: [
    body('fullname').notEmpty().withMessage('id field is required'),
    body('role')
      .notEmpty()
      .withMessage('role field is required')
      .isIn(['interviewer', 'candidate'])
      .withMessage('role has to be interviewer or candidate'),
  ],
  addSlot: [
    body('id').notEmpty().withMessage('id field is required'),
    body('slot').notEmpty().withMessage('slot field is required'),
  ],
};
