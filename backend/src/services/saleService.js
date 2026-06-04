import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";
import mongoose from "mongoose";

const getDiscountPercent = (purchasesCount) => {
    if (purchasesCount >= 8) return 15;
    if (purchasesCount >= 4) return 10;
    if (purchasesCount >= 1) return 5;
    return 0;
};

export const processSale = async ({ customer_id, items, user_id, payment_method }) => {
    let session;
    
    try {
        session = await mongoose.startSession();
        session.startTransaction();
    } catch (startError) {
        const isStandaloneErr = 
            startError.codeName === 'CommandNotSupported' || 
            startError.message.includes('replica set') || 
            startError.message.includes('transactions');

        if (isStandaloneErr) {
            console.warn("MongoDB Standalone detectado al iniciar sesión. Procesando venta sin transacciones ACID...");
            return processSaleWithoutTransaction({ customer_id, items, user_id, payment_method });
        }
        throw startError;
    }

    try {
        const productIds = items.map(i => i.product_id);
        const products = await Product.find({ _id: { $in: productIds } }).session(session);
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        let subtotal = 0;
        const saleItems = [];
        const bulkOps = [];

        for (const item of items) {
            const product = productMap.get(item.product_id.toString());

            if (!product || product.stock < item.quantity) {
                throw new Error(`Stock insuficiente o producto no encontrado: ${product?.name || "ID: " + item.product_id}`);
            }

            const lineTotal = product.price * item.quantity;
            subtotal += lineTotal;

            saleItems.push({
                product_id: product._id,
                product_name: product.name,
                unit_price: product.price,
                quantity: item.quantity,
                line_total: lineTotal,
            });

            bulkOps.push({
                updateOne: {
                    filter: { _id: product._id },
                    update: { $inc: { stock: -item.quantity } },
                },
            });
        }

        await Product.bulkWrite(bulkOps, { session });

        let customer = null;
        if (customer_id) {
            customer = await Customer.findById(customer_id).session(session);
        }

        let discount_percent = 0;
        let discount_amount = 0;
        let total = subtotal;

        if (customer) {
            discount_percent = getDiscountPercent(customer.purchases_count);

            if (discount_percent > 0) {
                discount_amount = parseFloat((subtotal * (discount_percent / 100)).toFixed(2));
                total = subtotal - discount_amount;
            }

            await Customer.updateOne(
                { _id: customer._id },
                { $inc: { purchases_count: 1 } },
                { session }
            );
        }

        const [newSale] = await Sale.create([{
            customer_id,
            user_id,
            items: saleItems,
            subtotal,
            discount_percent,
            discount_amount,
            total,
            payment_method,
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return newSale;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        const isStandaloneErr = 
            error.codeName === 'CommandNotSupported' || 
            error.message.includes('replica set') || 
            error.message.includes('transactions');

        if (isStandaloneErr) {
            console.warn("MongoDB Standalone detectado en proceso. Procesando venta sin transacciones ACID...");
            return processSaleWithoutTransaction({ customer_id, items, user_id, payment_method });
        }

        throw error;
    }
};

const processSaleWithoutTransaction = async ({ customer_id, items, user_id, payment_method }) => {
    const productIds = items.map(i => i.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    let subtotal = 0;
    const saleItems = [];
    const bulkOps = [];

    for (const item of items) {
        const product = productMap.get(item.product_id.toString());

        if (!product || product.stock < item.quantity) {
            throw new Error(`Stock insuficiente o producto no encontrado: ${product?.name || "ID: " + item.product_id}`);
        }

        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;

        saleItems.push({
            product_id: product._id,
            product_name: product.name,
            unit_price: product.price,
            quantity: item.quantity,
            line_total: lineTotal,
        });

        bulkOps.push({
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -item.quantity } },
            },
        });
    }

    const [customer] = await Promise.all([
        customer_id ? Customer.findById(customer_id) : Promise.resolve(null),
        Product.bulkWrite(bulkOps),
    ]);

    let discount_percent = 0;
    let discount_amount = 0;
    let total = subtotal;

    if (customer) {
        discount_percent = getDiscountPercent(customer.purchases_count);

        if (discount_percent > 0) {
            discount_amount = parseFloat((subtotal * (discount_percent / 100)).toFixed(2));
            total = subtotal - discount_amount;
        }

        await Customer.updateOne(
            { _id: customer._id },
            { $inc: { purchases_count: 1 } }
        );
    }

    return Sale.create({
        customer_id,
        user_id,
        items: saleItems,
        subtotal,
        discount_percent,
        discount_amount,
        total,
        payment_method,
    });
};