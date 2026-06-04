import * as customerService from "../services/customerService.js";

export const getOrCreateCustomer = async (req, res, next) => {
  try {
    const { phone_or_email, name } = req.body;

    const customer = await customerService.existingcustomer({ phone_or_email });
    if (customer) {
      return res.status(200).json(customer);
    }

    if (!name) {
      return res.status(404).json({ 
        error: "Customer not found", 
        message: "El cliente no existe, por favor proporciona un nombre para registrarlo." 
      });
    }

    const newCustomer = await customerService.createCustomer({ 
      name, 
      phone_or_email, 
      created_by: req.user.id 
    });

    return res.status(201).json(newCustomer);

  } catch (error) {
    next(error);
  }
};