import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    ProductCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true
    }
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
export default OrderItem;