import park from '../controllers/parksController';
import spot from '../controllers/spotsController';
import authorization from '../middleware/authorization';
import parkValidation from '../middleware/parkValidation';
import { verifyParkId } from '../middleware/idValidation';

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
}
