import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/auth', authRoutes);
export default router;