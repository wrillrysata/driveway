import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

const routes = app => {
  userRoutes(app);
  adminRoutes(app);
};

export default routes;
