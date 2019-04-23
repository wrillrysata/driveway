const { port } = require('./config');
import express from "express";
import cors from 'cors';
import router from './routes/routes';

const app = express();
app.use(cors());
router(app);
app.listen(port, () => console.log(`Driveway app listening on port ${port}`));
export default app;
