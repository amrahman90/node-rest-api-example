import { body } from 'express-validator';

const schema = [
  body('location').notEmpty().withMessage('Location is required'),
  body('status').isIn(['Totally Filled', 'Partially Filled', 'Empty']).withMessage('Invalid status value'),
];

export { schema as DrumContainerSchema };