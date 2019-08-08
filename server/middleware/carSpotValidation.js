import { isEmpty } from 'lodash';
import validator from 'validator';

const verifyNewCarSpot = (req, res, next) => {
  const errors = {};
  const { allocated_duration, occupant_id } = req.body;
  if (!allocated_duration) {
    errors.allocatedDuration = 'Please specify assigned duration of stay';
  } else if (
    allocated_duration &&
    !validator.isNumeric(allocated_duration.trim())
  ) {
    errors.allocatedDuration = 'Invalid value';
  }
  if (!occupant_id) {
    errors.occupantId = 'Please enter occupant identification';
  } else if (occupant_id && !validator.isAlphanumeric(occupant_id.trim())) {
    errors.occupantId =
      'Please enter a valid format for occupant identification';
  }
  if (isEmpty(errors)) {
    return next();
  }
  return res.status(400).json({ errors });
};
export default verifyNewCarSpot;
