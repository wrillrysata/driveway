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

/** 
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

export const verifySpotId = (req, res, next) => {
  const { spotId } = req.params;
  const errors = {};

  if (Number.isNaN(parseInt(spotId, 10))) {
    errors.spotId = 'Spot Id must be a number';
  }

  if (isEmpty(errors)) return next();
  return res.status(400).json({ errors });
};
**/