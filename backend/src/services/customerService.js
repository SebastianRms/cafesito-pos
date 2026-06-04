import Customer from '../models/Customer.js';

export const existingcustomer = async ({ phone_or_email }) => {

    const existingCustomer = await Customer.findOne({ phone_or_email });

    return await existingCustomer;
};

export const createCustomer = async ({ name, phone_or_email, created_by }) => {

    const newCustomer = new Customer({
        name,
        phone_or_email,
        purchases_count: 0, 
        created_by
    })
    return await newCustomer.save();
};