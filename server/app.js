import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './routes/routes';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
router(app);
app.listen(port, () => console.log(`Driveway app listening on port ${port}`));
export default app;
