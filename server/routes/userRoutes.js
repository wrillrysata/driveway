import user from '../controllers/usersController';
import { verifyUserSignUp } from '../middleware/userValidation';

export default function userRoutes(app) {
  app.post('/api/v1/users/signup', verifyUserSignUp, user.createUser);
}
