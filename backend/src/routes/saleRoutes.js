import { Router } from 'express';
import { createSale } from '../controllers/saleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validation.js';
import { createSaleValidator } from '../validators/saleValidator.js';

const router = Router();

router.post('/', authMiddleware, validate(createSaleValidator), createSale);

export default router;