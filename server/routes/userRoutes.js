import user from '../controllers/usersController';
import {
  verifyUserSignUp,
  verifyUserSignin,
  verifyEmail,
  verifyPassword,
} from '../middleware/userValidation';
import { verifyId } from '../middleware/idValidation';
import authorization from '../middleware/authorization';

export default function userRoutes(app) {
  app.post('/api/v1/users/signup', verifyUserSignUp, user.createUser);
  app.post('/api/v1/users/signin', verifyUserSignin, user.userLogin);
  app.get('/api/v1/users/:id/profile', verifyId, user.userProfile);
  app.put('/api/v1/users/profile', authorization, user.editUserProfile);
  app.post('/api/v1/users/recover-password', verifyEmail, user.recoverPassword);
  app.put(
    '/api/v1/users/password-reset',
    authorization,
    verifyPassword,
    user.resetPassword
  );
}
