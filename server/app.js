const { port } = require('./config');
import express from "express";
import cors from 'cors';

const app = express();
app.use(cors());
app.listen(port, () => console.log(`Driveway app listening on port ${port}`));
