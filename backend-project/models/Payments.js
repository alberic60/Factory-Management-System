import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  OrderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },productOrded:[{
    productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  unitPrice: {
    type: mongoose.Schema.Types.Number,
    ref: 'Product',
    required: true
   }
  }],
  AmountPaid: {
    type: Number,
    required: true
  },
  PaymentMethod: {
    type: String,
    default: 'Cash'
  },
  PaymentStatus: {
    type: String,
    default: 'Paid'
  },
  PaymentDate: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;