import db from '../models/index';
/**
 *@class usersController
 *
 * @export
 *
 */
export default class usersController{
/**
   * @description - Creates a new user
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberof usersController
   *
   * @returns {object} Class instance
   */
  static createUser(req, res) {
    const { username, email, password } = req;
    res.send({
        username, email
    })
  }
}