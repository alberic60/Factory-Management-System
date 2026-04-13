import Customer from '../models/Customers.js';

const getCustomers = async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
};

const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

const createCustomer = async (req, res) => {
  const { customerName, phoneNumber } = req.body;
  const newCustomer = new Customer({ customerName, phoneNumber });
  await newCustomer.save();
  res.status(201).json(newCustomer);
};

const updateCustomer = async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updated) return res.status(404).json({ message: 'Customer not found' });
  res.json(updated);
};

const deleteCustomer = async (req, res) => {
  const removed = await Customer.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Customer not found' });
  res.json({ message: 'Customer deleted' });
};

export default { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer }; 