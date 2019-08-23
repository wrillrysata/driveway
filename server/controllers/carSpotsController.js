import Sequelize from 'sequelize';
import moment from 'moment';
import db from '../models/index';

const errors = {
  title: 'Not Found',
  detail: 'A spot with that Id is not found',
};

/**
 *@class carSpotController
 *
 * @export
 *
 */
export default class carSpotController {
  /**
   * @description - Generates a Carspot
   * @static
   *
   * @param {Object} req - HTTP Request.
   * @param {Object} res - HTTP Response.
   *
   * @memberof carSpotController
   *
   * @returns {Object} Class instance.
   */

  static assignCarSpot(req, res) {
    const { allocated_duration, occupant_id } = req.body;
    db.Spot.findOne({
      where: {
        id: req.params.spotId,
      },
    })
      .then(foundSpot => {
        if (!foundSpot) {
          return res.status(404).json({
            errors,
          });
        }
        if (foundSpot && foundSpot.status == 'Free') {
          foundSpot.update({ status: 'Occupied' }).then(updatedSpot => {
            db.CarSpot.create({
              entry_timestamp: moment.utc(),
              allocated_duration,
              occupant_id,
              spotId: req.params.spotId,
            }).then(updatedSpot =>
              res.status(200).json({
                message: 'Successfully assigned car to spot',
              })
            );
          });
        } else if (foundSpot.status == 'Occupied') {
          res.status(400).json({
            errors: {
              status: '400',
              detail: 'The spot is already occupied',
            },
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
        console.log(Error)
      });
  }

  static removeCarSpot(req, res) {
    const { spotId } = req.params; //Id of carSpot

    db.CarSpot.findOne({
      where: {
        id: spotId,
      },
    })
      .then(foundCarSpot => {
        if (!foundCarSpot) {
          return res.status(404).json({
            errors,
          });
        }
        if (foundCarSpot) {
          const { spotId } = foundCarSpot;
          foundCarSpot.update({ exit_timestamp: moment.utc() });
          db.Spot.findOne({
            where: {
              id: spotId,
            },
          }).then(foundSpot => {
            foundSpot.update({ status: 'Free' });
            return res.status(201).json({
              message: 'Successfully removed car from spot',
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
        console.log(Error)
      });
  }
}
