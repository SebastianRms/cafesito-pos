import Product from '../models/Product.js';

export const getAllProducts = async ({ page = 1, limit = 12 }) => {
    const skip = (page - 1) * limit;

    const [products, totalResults] = await Promise.all([
        Product.find().skip(skip).limit(limit).sort({ name: 1 }),
        Product.countDocuments()
    ]);

    return {
        data: products,
        total: totalResults,
        page,
        limit,
        pages: Math.ceil(totalResults / limit)
    };
};

export const saveProduct = async (productData, created_by) => {
    if (Array.isArray(productData)) {
        const productsToInsert = productData.map((p) => ({
            ...p,
            created_by
        }));
        return await Product.insertMany(productsToInsert);
    } else {
        const { name, price, stock } = productData;
        const newProduct = new Product({ name, price, stock, created_by });
        return await newProduct.save();
    }
};

export const removeProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export const modifyProduct = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};