import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { validate } from '../middlewares/validation.js';
import { createProductValidator } from '../validators/product_validator.js';
import authMiddleware from '../middlewares/auth-middleware.js'; 
import { isAdmin } from '../middlewares/is-admin.js';

const router = express.Router();

router.post('/', 
  authMiddleware, 
  isAdmin, 
  validate(createProductValidator), 
  createProduct
);

export default router;