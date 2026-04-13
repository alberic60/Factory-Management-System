import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;