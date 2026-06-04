import * as productService from '../services/productService.js';

async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const result = await productService.getAllProducts({ page, limit });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const saved = await productService.saveProduct(req.body, req.user.id);
    return res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.removeProduct(id);
    return res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const updatedProduct = await productService.modifyProduct(id, { name, price, stock });
    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export { getProducts, createProduct, deleteProduct, updateProduct };