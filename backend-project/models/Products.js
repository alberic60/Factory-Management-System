import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },productAmount: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
