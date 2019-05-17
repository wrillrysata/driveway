import user from '../controllers/usersController';
import {
  verifyUserSignUp,
  verifyUserSignin,
} from '../middleware/userValidation';
import { verifyUserId } from '../middleware/idValidation';
import authorization from '../middleware/authorization';

export default function userRoutes(app) {
  app.post('/api/v1/users/signup', verifyUserSignUp, user.createUser);
  app.post('/api/v1/users/signin', verifyUserSignin, user.userLogin);
  app.get('/api/v1/users/:userId/profile', verifyUserId, user.userProfile);
  app.put('/api/v1/users/:userId/profile', authorization, user.editUserProfile);
}
