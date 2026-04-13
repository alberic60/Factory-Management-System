import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [editId, setEditId] = useState(null);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load orders.');
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data || []);
    } catch {
      // ignore
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadOrders(), loadCustomers(), loadProducts()]);
      setLoading(false);
    };
    init();
  }, []);

  const addOrderItem = () => {
    setOrderItems([...orderItems, { ProductID: '', Quantity: 1 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const clearForm = () => {
    setCustomerId('');
    setOrderItems([]);
    setEditId(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    if (!customerId) {
      setError('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    // Validate items
    for (const item of orderItems) {
      if (!item.ProductID || item.Quantity < 1) {
        setError('Please select valid products and quantities');
        return;
      }
      // Check stock availability
      const product = products.find(p => p._id === item.ProductID);
      if (!product || product.productAmount < item.Quantity) {
        setError(`Insufficient stock for ${product?.productName || 'selected product'}`);
        return;
      }
    }

    try {
      const payload = { CustomerID: customerId, OrderItems: orderItems };
      if (editId) {
        await api.put(`/orders/${editId}`, payload);
      } else {
        await api.post('/orders', payload);
      }
      clearForm();
      await Promise.all([loadOrders(), loadProducts()]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save order.');
    }
  };

  const handleDelete = async id => {
    setError('');
    try {
      await api.delete(`/orders/${id}`);
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete order.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Orders</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create order</h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">Total: {orders.length}</div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Customer</span>
            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-700">Order Items</label>
              <button
                type="button"
                onClick={addOrderItem}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                + Add Product
              </button>
            </div>

            {orderItems.length === 0 ? (
              <p className="text-sm text-slate-500">No products added yet. Click "Add Product" to get started.</p>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <label className="flex-1 block">
                      <span className="text-sm font-medium text-slate-700">Product</span>
                      <select
                        value={item.ProductID}
                        onChange={e => updateOrderItem(index, 'ProductID', e.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      >
                        <option value="">Select product</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.productName} (Stock: {product.productAmount})
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="w-32 block">
                      <span className="text-sm font-medium text-slate-700">Qty</span>
                      <input
                        type="number"
                        value={item.Quantity}
                        onChange={e => updateOrderItem(index, 'Quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
              {editId ? 'Update order' : 'Create order'}
            </button>
            {editId && (
              <button type="button" onClick={clearForm} className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">Order History</h2>
        {loading ? (
          <p className="text-slate-600">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-slate-600">No orders available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Order ID</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Customer</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Items</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Date</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-900">{order._id.slice(-6)}</td>
                    <td className="px-4 py-4 text-slate-700">{order.CustomerID?.customerName || '—'}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {order.OrderItems?.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.ProductID?.productName || 'Unknown'} x {item.Quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4 text-slate-500">{new Date(order.OrderDate || Date.now()).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-slate-500 space-x-2">
                      <button onClick={() => handleDelete(order._id)} className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
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
