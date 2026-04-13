import express from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

connectDB();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 }
    })
);
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});