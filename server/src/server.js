import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});

app.get('/', (_, res) => {
  res.send('Hello from backend');
});
