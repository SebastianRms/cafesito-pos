import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts
} from "../controllers/productController.js";
import { validate } from "../middlewares/validation.js";
import { createProductValidator } from "../validators/productValidator.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", getProducts);

router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createProductValidator),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  deleteProduct
);

export default router;
