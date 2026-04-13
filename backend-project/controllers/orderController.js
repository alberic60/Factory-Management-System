import Order from '../models/Orders.js';
import Product from '../models/Products.js';

const getOrders = async (req, res) => {
  const orders = await Order.find().populate('CustomerID').populate('OrderItems.ProductID');
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('CustomerID').populate('OrderItems.ProductID');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

const createOrder = async (req, res) => {
  try {
    const { CustomerID, OrderItems } = req.body;

    // Validate that OrderItems are provided
    if (!OrderItems || OrderItems.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one product' });
    }

    // Validate product availability and check stock
    for (const item of OrderItems) {
      const product = await Product.findById(item.ProductID);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.ProductID} not found` });
      }
      if (product.productAmount < item.Quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.productName}. Available: ${product.productAmount}, Requested: ${item.Quantity}` 
        });
      }
    }

    // Create the order
    const order = new Order({ CustomerID, OrderItems, OrderDate: new Date() });
    await order.save();

    // Decrement product stock for each item ordered
    for (const item of OrderItems) {
      await Product.findByIdAndUpdate(
        item.ProductID,
        { $inc: { productAmount: -item.Quantity } },
        { new: true }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('CustomerID');
  if (!updated) return res.status(404).json({ message: 'Order not found' });
  res.json(updated);
};

const deleteOrder = async (req, res) => {
  const removed = await Order.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Order not found' });
  res.json({ message: 'Order deleted' });
};

export default { getOrders, getOrderById, createOrder, updateOrder, deleteOrder }; 