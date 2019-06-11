import park from '../controllers/parksController';
import authorization from '../middleware/authorization';
import parkValidation from '../middleware/parkValidation';

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
}
