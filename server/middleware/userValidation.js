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

export const verifyUserSignin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = {};
  if (!username) {
    errors.username = 'Please provide a username or email';
  } else if (username && validator.isEmpty(username.trim())) {
    errors.username = 'Username or email cannot be empty';
  } else if (!password) {
    errors.password = 'Password is required';
  }
  if (isEmpty(errors)) {
    return next();
  }
  return res.status(400).json({
    errors,
  });
};

export const verifyEmail = (req, res, next) => {
  const { email } = req.body;
  const errors = {};
  if (!email) {
    errors.email = 'Email is required';
  } else if (email && !validator.isEmail(email.trim())) {
    errors.email = 'Email is invalid or empty';
  }
  if (isEmpty(errors)) {
    return next();
  }
  return res.status(400).json({
    errors,
  });
};

export const verifyPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const errors = {};
  if (!password) {
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
  return res.status(400).json({
    errors,
  });
};
