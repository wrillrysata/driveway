import park from '../controllers/parksController';
import spot from '../controllers/spotsController';
import carSpot from '../controllers/carSpotsController';
import authorization from '../middleware/authorization';
import parkValidation from '../middleware/parkValidation';
import carSpotValidation from '../middleware/carSpotValidation';
import {
  verifyId,
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
    .route('/api/v1/parks/:id')
    .put(authorization, verifyId, park.editPark)
    .delete(authorization, verifyId, park.deletePark)
    .get(authorization, verifyId, park.getAPark);

  // generate a spot
  app
    .route('/api/v1/parks/:id/spot/new')
    .post(authorization, spot.generateSpot);

  app
    .route('/api/v1/spot/:id')
    // delete a spot
    .delete(authorization, verifyId, spot.deleteSpot);

  // assign car to spot
  app
    .route('/api/v1/spot/:id/car-spot')
    .post(
      authorization,
      verifyId,
      carSpotValidation,
      carSpot.assignCarSpot
    );
  // remove car from spot
  app
    .route('/api/v1/car-spot/:id')
    .delete(authorization, verifyId, carSpot.removeCarSpot);
}
