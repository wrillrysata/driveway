import Sequelize from 'sequelize';
import randomstring from 'randomstring';
import db from '../models/index';

const errors = {
  title: 'Not Found',
  detail: 'A spot with that Id is not found',
};
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

  /**
   * @description - Deletes a spot
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof spotsController
   *
   * @returns {Object} Class instance.
   */
  static deleteSpot(req, res) {
    db.Spot.findOne({
      where: {
        id: req.params.spotId,
        userId: req.userId,
      },
    })
      .then(foundSpot => {
        if (foundSpot) {
          db.Spot.destroy({
            where: {
              id: req.params.spotId,
              userId: req.userId,
            },
            cascade: true,
          }).then(() =>
            res.status(200).json({
              data: {
                message: 'Spot deleted successfully',
              },
            })
          );
        }
        if (!foundSpot) {
          return res.status(404).json({
            errors,
          });
        }
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
