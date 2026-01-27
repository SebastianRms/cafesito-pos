import express from 'express';
import { getProducts } from '../controllers/productController.js';
import { query, validationResult } from 'express-validator'; // <--- Ambos deben estar aquí
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // Si no hay errores, pasa al controlador
};

const router = express.Router();

router.get('/products', [
  query('page')
    .optional()
    .isNumeric().withMessage('Page parameter must be a number'),
  query('limit')
    .optional()
    .isNumeric().withMessage('Limit parameter must be a number'),
], validate, getProducts);

export default router;