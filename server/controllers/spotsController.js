import Sequelize from 'sequelize';
import randomstring from 'randomstring';
import db from '../models/index';
/**
 *@class spotsController
 *
 * @export
 *
 */
export default class spotsController {
  /**
   * @description - Generates a spot
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof spotsController
   *
   * @returns {Object} Class instance.
   */

  static generateSpot(req, res) {
    const randomString = randomstring.generate({
      length: 3,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
    const spotname = `Spot ${randomString}`;
    const { status } = req.body;
    db.Spot.findOne({
      where: {
        spotname,
        userId: req.userId,
      },
    })
      .then(foundSpot => {
        if (foundSpot) {
          return res.status(409).json({
            errors: {
              title: 'Conflict',
              detail: 'You already have a spot with that name',
            },
          });
        }
        if (!foundSpot) {
          db.Spot.create({
            spotname,
            userId: req.userId,
            parkId: req.params.parkId,
            status,
          }).then(newSpot => {
            res.status(201).json({
              data: {
                message: 'Spot created successfully',
              },
            });
          });
        }
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
}
