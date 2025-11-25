import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

connectDB();

app.get('/', (req, res) => {
  res.json({ status: 'Server running', version: '1.0' });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
