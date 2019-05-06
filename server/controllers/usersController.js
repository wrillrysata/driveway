import db from '../models/index';

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
  }
}
