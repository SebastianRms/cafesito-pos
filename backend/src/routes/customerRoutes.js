import { Router } from 'express';
import { getOrCreateCustomer } from '../controllers/customerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validation.js';
import { createCustomerValidator } from '../validators/customerValidator.js';

const router = Router();

router.post('/', authMiddleware, validate(createCustomerValidator), getOrCreateCustomer);
export default router;