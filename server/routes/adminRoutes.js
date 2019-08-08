import park from '../controllers/parksController';
import spot from '../controllers/spotsController';
import carSpot from '../controllers/carSpotsController';
import authorization from '../middleware/authorization';
import parkValidation from '../middleware/parkValidation';
import carSpotValidation from '../middleware/carSpotValidation';
import {
  verifyParkId,
  verifySpotId,
  verifyCarSpotId,
} from '../middleware/idValidation';

/**
 *@Function adminRoutes.
 *
 * @export
 * @param {any} app
 *
 * @returns {void}
 */
export default function adminRoutes(app) {
  app
    .route('/api/v1/parks')
    .post(authorization, parkValidation, park.createPark)
    .get(authorization, park.getParks);

  app
    .route('/api/v1/parks/:parkId')
    .put(authorization, verifyParkId, park.editPark)
    .delete(authorization, verifyParkId, park.deletePark)
    .get(authorization, verifyParkId, park.getAPark);

  // generate a spot
  app
    .route('/api/v1/parks/:parkId/spot/new')
    .post(authorization, spot.generateSpot);

  app
    .route('/api/v1/spot/:spotId')
    // delete a spot
    .delete(authorization, verifySpotId, spot.deleteSpot);

  // assign car to spot
  app
    .route('/api/v1/spot/:spotId/car-spot')
    .post(
      authorization,
      verifySpotId,
      carSpotValidation,
      carSpot.assignCarSpot
    );
  // remove car from spot
  app
    .route('/api/v1/car-spot/:spotId')
    .delete(authorization, verifySpotId, carSpot.removeCarSpot);
}
