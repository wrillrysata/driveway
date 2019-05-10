import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../models/index';
import generateToken from '../utils';

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
    }).then(existingUser => {
      if (existingUser) {
        return res.status(409).json({
          errors: {
            title: 'Conflict',
            detail: 'Username or Email already exist, please login',
          },
        });
      }
    });

    return db.User.create({
      username,
      email,
      bio,
      location,
      password,
    })
      .then(newUser => {
        const token = generateToken(newUser);
        return res.status(201).json({
          data: {
            token,
          },
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
}
