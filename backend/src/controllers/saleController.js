import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

export const createSale = async (req, res) => {
  try {
    const { customer_id, items, payment_method } = req.body;
    const user_id = req.user.id; // Obtenido del authMiddleware

    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      // 1. Usar findById (Mongoose) en lugar de findByPk
      const product = await Product.findById(item.product_id);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente o producto no encontrado: ${product?.name || "ID: " + item.product_id}`,
        });
      }

      // 2. Preparar el Snapshot para el array de items
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      saleItems.push({
        product_id: product._id,
        product_name: product.name, // Snapshot del nombre
        unit_price: product.price, // Snapshot del precio
        quantity: item.quantity,
        line_total: lineTotal,
      });

      // 3. Actualizar stock (Mongoose style)
      product.stock -= item.quantity;
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -item.quantity } },
      );
    }

    // 4. Lógica de Descuentos
    let total = subtotal;
    let discount_amount = 0;
    let discount_percent = 0;

    if (customer_id) {
      const customer = await Customer.findById(customer_id);
      if (customer) {
        if (customer.purchasesCount >= 5) {
          discount_percent = 10;
          discount_amount = subtotal * 0.1;
          total = subtotal - discount_amount;
        }
        // Incrementar contador de compras
        customer.purchasesCount += 1;
        await customer.save();
      }
    }

    // 5. Crear la venta en la BD
    const sale = await Sale.create({
      customer_id,
      user_id,
      items: saleItems,
      subtotal,
      discount_percent,
      discount_amount,
      total,
      payment_method,
    });

    res.status(201).json({
      ...sale.toJSON(),
      ticket: sale.generateTicket(),
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};
