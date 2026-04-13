import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productName, setProductName] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const clearForm = () => {
    setProductName('');
    setProductAmount('');
    setUnitPrice('');
    setEditId(null);
    setEditName('');
    setEditAmount('');
    setEditPrice('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        productName: editId ? editName : productName,
        productAmount: Number(editId ? editAmount : productAmount),
        unitPrice: Number(editId ? editPrice : unitPrice)
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      clearForm();
      loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save product.');
    }
  };

  const startEdit = product => {
    setEditId(product._id);
    setEditName(product.productName);
    setEditAmount(product.productAmount ?? '');
    setEditPrice(product.unitPrice);
  };

  const handleDelete = async id => {
    setError('');
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete product.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Products</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Manage products</h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">Total: {products.length}</div>
        </div>

        <form className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Product name</span>
            <input
              value={editId ? editName : productName}
              onChange={e => (editId ? setEditName(e.target.value) : setProductName(e.target.value))}
              placeholder="Enter product name"
              required
              className="mt-2 w-full"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Quantity</span>
            <input
              type="number"
              value={editId ? editAmount : productAmount}
              onChange={e => (editId ? setEditAmount(e.target.value) : setProductAmount(e.target.value))}
              placeholder="Enter quantity"
              min="0"
              required
              className="mt-2 w-full"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Unit price</span>
            <input
              type="number"
              value={editId ? editPrice : unitPrice}
              onChange={e => (editId ? setEditPrice(e.target.value) : setUnitPrice(e.target.value))}
              placeholder="Enter price"
              required
              className="mt-2 w-full"
            />
          </label>

          <div className="flex items-end gap-3">
            <button type="submit" className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
              {editId ? 'Update product' : 'Add product'}
            </button>
            {editId && (
              <button type="button" onClick={clearForm} className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {loading ? (
          <p className="text-slate-600">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-slate-600">No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Product</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Quantity</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Price</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-900">{product.productName}</td>
                    <td className="px-4 py-4 text-slate-700">{product.productAmount}</td>
                    <td className="px-4 py-4 text-slate-700">{product.unitPrice} <i>FRW</i></td>
                    <td className="px-4 py-4 text-slate-500 space-x-2">
                      <button onClick={() => startEdit(product)} className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-600">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
