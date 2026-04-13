import Order from '../models/Orders.js';
import OrderItem from '../models/OrderItems.js';
import { invoiceGenerator } from '../utils/invoiceGenerator.js';

const generateInvoice = async (orderId) => {
    const foundOrder = await Order.findById(orderId).populate("CustomerID");
    const items = await OrderItem.find({ orderId: orderId }).populate("ProductCode");

    return invoiceGenerator(foundOrder, items);
};

export default { generateInvoice };