import Product from '../models/Product.js';

export const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      created_by: req.user.id
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    next(error);
  }
};

async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const totalResults = await Product.countDocuments();
    const totalPages = Math.ceil(totalResults / limit);
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    next(error);
  }
}


export { getProducts };