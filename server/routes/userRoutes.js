import user from '../controllers/usersController';
import {
  verifyUserSignUp,
  verifyUserSignin,
} from '../middleware/userValidation';

export default function userRoutes(app) {
  app.post('/api/v1/users/signup', verifyUserSignUp, user.createUser);
  app.post('/api/v1/users/signin', verifyUserSignin, user.userLogin);
}
