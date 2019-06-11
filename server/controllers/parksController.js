import Sequelize from 'sequelize';
import db from '../models/index';

/**
 *@class parksController
 *
 * @export
 *
 */
export default class parksController {
  /**
   * @description - Creates a park
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof parksController
   *
   * @returns {Object} Class instance.
   */
  static createPark(req, res) {
    const { parkname, initialSpots, status } = req.body;
    let i;
    db.Park.findOne({
      where: {
        parkname,
        userId: req.userId,
      },
    })
      .then(foundPark => {
        if (foundPark) {
          return res.status(409).json({
            errors: {
              title: 'Conflict',
              detail: 'You already have a park with that name',
            },
          });
        }
        if (!foundPark) {
          db.Park.create({
            parkname,
            userId: req.userId,
            initialSpots,
            status,
          }).then(newPark => {
            // Iterate and add the corresponding number of spots to park in database
            for (i = 1; i <= initialSpots; i++) {
              db.Spot.create({
                spotname: `Spot ${i}`,
                userId: req.userId,
                parkId: newPark.id,
                status: 'Free',
              });
            }
            res.status(201).json({
              data: {
                message: 'Park created successfully',
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
