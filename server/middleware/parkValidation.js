import { isEmpty } from 'lodash';
import validator from 'validator';

const verifyNewPark = (req, res, next) => {
  const errors = {};
  const { parkname, initialSpots } = req.body;
  if (!parkname) {
    errors.parkname = 'Please enter a parkname';
  } else if (parkname && validator.isEmpty(parkname.trim())) {
    errors.parkname = 'Parkname cannot be empty';
  }
  if (!initialSpots) {
    errors.initialSpots = 'Please estimate the number of spots in your park';
  } else if (Number.isNaN(parseInt(initialSpots, 10))) {
    errors.initialSpots = 'Invalid value for spots';
  }

  if (isEmpty(errors)) {
    return next();
  }
  return res.status(400).json({ errors });
};
export default verifyNewPark;
