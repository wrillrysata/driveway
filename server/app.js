import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
routes(app);
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Driveway API');
});

app.use('*', (req, res) =>
  res.send({
    message: 'The API route you requested does not exist',
  })
);
app.listen(port, () => console.log(`Driveway app listening on port ${port}`));
export default app;
