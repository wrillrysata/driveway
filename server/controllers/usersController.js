import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models/index';
import generateToken from '../utils';
import sendEmail from '../helperFunctions/sendEmail';

/**
 *@class usersController
 *
 * @export
 *
 */
export default class usersController {
  /**
   * @description - Creates a new user
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof usersController
   *
   * @returns {Object} Class instance.
   */
  static createUser(req, res) {
    const {
      username,
      email,
      bio,
      location,
      password,
      confirmPassword,
    } = req.body;
    const { Op } = Sequelize;
    db.User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    })
      .then(existingUser => {
        if (existingUser) {
          return res.status(409).json({
            errors: {
              title: 'Conflict',
              detail: 'Username or Email already exist, please login',
            },
          });
        }

        return db.User.create({
          username,
          email,
          bio,
          location,
          password,
        }).then(newUser => {
          const token = generateToken(newUser);
          return res.status(201).json({
            data: {
              token,
            },
          });
        });
      })
      .catch(Error => {
        res.status(500).json({
          errors: {
            status: '500',
            detail: 'Internal server error',
          },
        });
      });
  }

  /**
   * @description - Logs in a user
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof usersController
   *
   * @returns {Object} Class instance.
   */
  static userLogin(req, res) {
    const errors = {
      title: 'Not Found',
      detail: 'These credentials do not match our record',
    };
    const { username, password } = req.body;
    const { Op } = Sequelize;
    db.User.findOne({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.username },
        ],
      },
    })
      .then(foundUser => {
        if (!foundUser) {
          return res.status(404).json({
            errors,
          });
        }
        if (!bcrypt.compareSync(password, foundUser.password)) {
          return res.status(404).json({
            errors: {
              title: 'Not Found',
              detail: 'Wrong username or password',
            },
          });
        }
        const token = generateToken(foundUser);
        res.status(200).json({
          data: {
            token,
          },
        });
      })
      .catch(() =>
        res.status(500).json({
          errors: {
            status: '500',
            detail: 'Internal server error',
          },
        })
      );
  }

  /**
   * @description - Gets a users' profile
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof usersController
   *
   * @returns {Object} Class instance.
   */
  static userProfile(req, res) {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({
        errors: {
          title: 'Unauthorized',
          detail: 'You are not allowed to perform this action',
        },
      });
    }
    db.User.findOne({
      where: {
        id: req.params.userId,
      },
    })
      .then(existingUser => {
        if (!existingUser) {
          return res.status(404).json({
            errors: {
              title: 'Not Found',
              detail: 'A user with that Id is not found',
            },
          });
        }
        if (existingUser && token) {
          jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
              return res.status(500).json({
                detail:
                  'There was an error while authenticating you, please sign in again',
              });
            }
            if (decoded.id === parseInt(req.params.userId, 10)) {
              return res.status(200).json({
                data: {
                  user: {
                    username: existingUser.username,
                    email: existingUser.email,
                    bio: existingUser.bio,
                    location: existingUser.location,
                  },
                },
              });
            }
            return res.status(401).json({
              errors: {
                title: 'Unauthorized',
                detail: 'You are not allowed to perform this action',
              },
            });
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          errors: {
            status: '500',
            detail: 'Internal server error',
          },
        });
      });
  }

  /**
   * @description - Edits a users' profile
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof usersController
   *
   * @returns {Object} Class instance.
   */
  static editUserProfile(req, res) {
    const { username, bio, location } = req.body;
    db.User.findOne({
      where: {
        id: req.userId,
      },
    })
      .then(foundUser => {
        if (!foundUser) {
          return res.status(404).json({
            error: {
              title: 'Not Found',
              detail: `Can't find user with id ${req.userId}`,
            },
          });
        }
        if (foundUser) {
          const userDetails = {
            username: username ? username.trim() : foundUser.username,
            bio: bio ? bio.trim() : foundUser.bio,
            location: location ? location.trim() : foundUser.location,
          };
          foundUser.update(userDetails).then(updatedUser =>
            res.status(200).json({
              data: {
                user: {
                  username: updatedUser.username,
                  bio: updatedUser.bio,
                  location: updatedUser.location,
                  email: updatedUser.email,
                },
              },
            })
          );
        }
      })
      .catch(error => {
        res.status(500).json({
          errors: {
            status: '500',
            detail: 'Internal server error',
          },
        });
      });
  }

  /**
   * @description - Request by user to recover lost password
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof usersController
   *
   * @returns {Object} Class instance.
   */
  static recoverPassword(req, res) {
    const { email } = req.body;
    db.User.findOne({
      where: {
        email,
      },
    })
      .then(foundUser => {
        if (!foundUser) {
          return res.status(404).json({
            errors: {
              title: 'Not Found',
              detail: 'Email not found',
            },
          });
        }
        if (foundUser) {
          const token = generateToken(foundUser);
          foundUser.update({ token }).then(() => {
            const url = `http://${
              req.headers.host
            }/api/v1/users/password-reset/${token}`;
            sendEmail(foundUser.email, url, res);
          });
        }
      })
      .catch(() =>
        res.status(500).json({
          errors: {
            detail: 'internal server error',
          },
        })
      );
  }

  /**
   * @description - Link for user to reset their password
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof usersController
   *
   * @returns {Object} Class instance.
   */
  static resetPassword(req, res) {
    const { password } = req.body;
    db.User.findOne({
      where: {
        id: req.userId,
      },
    })
      .then(foundUser => {
        if (foundUser.token === req.headers.token) {
          const newPassword = {
            password: bcrypt.hashSync(password, 10),
            token: null,
          };
          foundUser.update(newPassword).then(() =>
            res.status(200).json({
              message: 'Password reset was successful, Please login',
            })
          );
        } else {
          return res.status(401).json({
            message: 'You do not have the permission to perform this action',
          });
        }
      })
      .catch(Error => {
        res.status(500).json({
          errors: {
            status: '500',
            detail: 'internal server error',
          },
        });
      });
  }
}
