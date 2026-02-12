import Customer from '../models/Customer.js';

export const getOrCreateCustomer = async (req, res, next) => {
  try {
    const { phone_or_email, name } = req.body;

    const existingCustomer = await Customer.findOne({ phone_or_email });

    if (existingCustomer) {
      return res.status(200).json(existingCustomer);
    }

    if (!name) {
      return res.status(404).json({ 
        error: "Customer not found", 
        message: "El cliente no existe, por favor proporciona un nombre para registrarlo." 
      });
    }

    const newCustomer = new Customer({
      name,
      phone_or_email,
      purchases_count: 0, 
      created_by: req.user.id
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);

  } catch (error) {
    next(error);
  }
};