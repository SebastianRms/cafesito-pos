import * as saleService from '../services/saleService.js';

export const createSale = async (req, res, next) => {
  try {
    const { customer_id, items, payment_method } = req.body;
    const user_id = req.user.id; 

    const sale = await saleService.processSale({ 
        customer_id, 
        items, 
        user_id, 
        payment_method 
    });

    return res.status(201).json({
      ...sale.toJSON(),
      ticket: sale.generateTicket(),
    });

  } catch (error) {
    if (error.message.includes("Stock insuficiente")) {
        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Error interno", error: error.message });
  }
};
