import Product from '../models/Products.js';

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  const removed = await Product.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct }; 