import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

export const createSale = async (req, res) => {
  try {
    const { customer_id, items, payment_method } = req.body;
    const user_id = req.user.id; 

    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente o producto no encontrado: ${product?.name || "ID: " + item.product_id}`,
        });
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

      product.stock -= item.quantity;
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -item.quantity } },
      );
    }

    let total = subtotal;
    let discount_amount = 0;
    let discount_percent = 0;

    if (customer_id) {
      const customer = await Customer.findById(customer_id);
      if (customer) {
        const count = customer.purchases_count; 

        if (count >= 8) {
          discount_percent = 15;
        } else if (count >= 4) {
          discount_percent = 10;
        } else if (count >= 1) {
          discount_percent = 5;
        }

        if (discount_percent > 0) {
          discount_amount = parseFloat((subtotal * (discount_percent / 100)).toFixed(2));
          total = subtotal - discount_amount;
        }

        customer.purchases_count += 1;
        await customer.save();
      }
    }

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
