import { isEmpty } from 'lodash';

export const verifyUserId = (req, res, next) => {
  const { userId } = req.params;
  const errors = {};

  if (Number.isNaN(parseInt(userId, 10))) {
    errors.userId = 'Invalid user Id';
  }

  if (isEmpty(errors)) return next();
  return res.status(400).json({ errors });
};

export const verifyParkId = (req, res, next) => {
  const { parkId } = req.params;
  const errors = {};

  if (Number.isNaN(parseInt(parkId, 10))) {
    errors.parkId = 'Park Id must be a number';
  }

  if (isEmpty(errors)) return next();
  return res.status(400).json({ errors });
};
