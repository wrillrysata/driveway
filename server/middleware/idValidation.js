import { isEmpty } from 'lodash';

export const verifyId = (req, res, next) => {
  const { id } = req.params;
  const errors = {};

  if (Number.isNaN(parseInt(id, 10))) {
    errors.id = 'Id must be a number';
  }

  if (isEmpty(errors)) return next();
  return res.status(400).json({ errors });
};