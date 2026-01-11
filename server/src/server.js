import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.config.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/errorHandler.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, from the API!');
});

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
