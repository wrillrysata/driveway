import { isEmpty } from 'lodash';
import validator from 'validator';

export const verifyUserSignUp = (req, res, next) => {
  const { username, email, location, password, confirmPassword } = req.body;
  const errors = {};
  if (!username) {
    errors.username = 'Username is required';
  } else if (username && validator.isEmpty(username.trim())) {
    errors.username = 'Username cannot be empty';
  } else if (!email) {
    errors.email = 'Email is required';
  } else if (email && !validator.isEmail(email.trim())) {
    errors.email = 'Email is invalid or empty';
  } else if (!location) {
    errors.location = 'Location is required';
  } else if (!password) {
    errors.password = 'Password is required';
  } else if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (
    validator.isEmpty(password) ||
    validator.isEmpty(confirmPassword) ||
    confirmPassword.trim() !== password.trim()
  ) {
    errors.confirmPassword = "Passwords don't match";
  }
  if (isEmpty(errors)) {
    return next();
  }
  return res.status(400).json({ errors });
};
