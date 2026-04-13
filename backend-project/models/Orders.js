import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    CustomerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    OrderItems: [{
        ProductID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        Quantity: {
            type: Number,
            required: true
        }
    }],

    OrderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;