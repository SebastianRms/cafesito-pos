import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { validate } from '../middlewares/validation.js';
import { createProductValidator } from '../validators/productValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 
import { isAdmin } from '../middlewares/isAdmin.js';
import { getProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', 
  authMiddleware, 
  isAdmin, 
  validate(createProductValidator), 
  createProduct
);

export default router;