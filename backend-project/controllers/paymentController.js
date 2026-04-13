import Payment from '../models/Payments.js';

const getPayments = async (req, res) => {
  const payments = await Payment.find().populate('CustomerID OrderID productName');
  res.json(payments);
};

const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('CustomerID OrderID productName');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
};

const createPayment = async (req, res) => {
  const payment = new Payment(req.body);
  await payment.save();
  res.status(201).json(payment);
};

const updatePayment = async (req, res) => {
  const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('CustomerID OrderID productName');
  if (!updated) return res.status(404).json({ message: 'Payment not found' });
  res.json(updated);
};

const deletePayment = async (req, res) => {
  const removed = await Payment.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Payment not found' });
  res.json({ message: 'Payment deleted' });
};

export default { getPayments, getPaymentById, createPayment, updatePayment, deletePayment };
 