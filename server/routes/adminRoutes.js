import park from '../controllers/parksController';
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
    .post(authorization, parkValidation, park.createPark);

  app
    .route('/api/v1/parks/:parkId')
    .put(authorization, verifyParkId, park.editPark)
    .delete(authorization, verifyParkId, park.deletePark);
}
