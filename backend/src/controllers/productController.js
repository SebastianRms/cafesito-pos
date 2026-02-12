import Product from '../models/Product.js';

async function createProduct(req, res, next) {
  try {
    const { name, price, stock } = req.body; 
    
    const newProduct = new Product({
      name,
      price,
      stock,
      created_by: req.user.id
    });

    const savedProduct = await newProduct.save();
    
    res.status(201).json(savedProduct);

  } catch (error) {
    next(error);
  }
};

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; 
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const totalResults = await Product.countDocuments();

    res.json({
      data: products, 
      total: totalResults,
      page: page,
      limit: limit
    });

  } catch (error) {
    next(error);
  }
}

export { getProducts, createProduct, deleteProduct, updateProduct };