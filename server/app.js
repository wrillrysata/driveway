import config from './config/config';
import express from "express";
import cors from 'cors';
import router from './routes/routes';

const port = config[process.env.NODE_ENV].port;

const app = express();
app.use(cors());
router(app);
app.listen(port, () => console.log(`Driveway app listening on port ${port}`));
export default app;
