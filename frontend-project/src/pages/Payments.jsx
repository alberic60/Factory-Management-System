import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [editId, setEditId] = useState(null);

  const loadPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load payments.');
    }
  };

  const loadDependencies = async () => {
    try {
      const [customersRes, ordersRes, productsRes] = await Promise.all([
        api.get('/customers'),
        api.get('/orders'),
        api.get('/products')
      ]);
      setCustomers(customersRes.data || []);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    } catch {
      // ignore missing customer/order/product list errors for now
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadPayments(), loadDependencies()]);
      setLoading(false);
    };
    init();
  }, []);

  const clearForm = () => {
    setCustomerId('');
    setOrderId('');
    setProductId('');
    setProductAmount('');
    setAmount('');
    setPaymentMethod('Cash');
    setPaymentStatus('Paid');
    setEditId(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    try {
      const payload = {
        CustomerID: customerId,
        OrderID: orderId,
        productName: productId,
        productAmount: Number(productAmount),
        AmountPaid: Number(amount),
        PaymentMethod: paymentMethod,
        PaymentStatus: paymentStatus
      };

      if (editId) {
        await api.put(`/payments/${editId}`, payload);
      } else {
        await api.post('/payments', payload);
      }

      clearForm();
      await loadPayments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save payment record.');
    }
  };

  const startEdit = payment => {
    setEditId(payment._id);
    setCustomerId(payment.CustomerID?._id || payment.CustomerID || '');
    setOrderId(payment.OrderID?._id || payment.OrderID || '');
    setProductId(payment.productName?._id || payment.productName || '');
    setProductAmount(payment.productAmount ?? '');
    setAmount(payment.AmountPaid ?? '');
    setPaymentMethod(payment.PaymentMethod || 'Cash');
    setPaymentStatus(payment.PaymentStatus || 'Paid');
  };

  const handleDelete = async id => {
    setError('');
    try {
      await api.delete(`/payments/${id}`);
      await loadPayments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete payment.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Payments</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Manage payments</h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">Total: {payments.length}</div>
        </div>

        <form className="grid gap-4 lg:grid-cols-[1fr_1fr]" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Customer</span>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)} required className="mt-2 w-full">
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Order</span>
            <select value={orderId} onChange={e => setOrderId(e.target.value)} required className="mt-2 w-full">
              <option value="">Select order</option>
              {orders.map(order => (
                <option key={order._id} value={order._id}>
                  {order._id} - {order.CustomerID?.customerName || order.customer || 'Unknown'}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Product</span>
            <select value={productId} onChange={e => setProductId(e.target.value)} required className="mt-2 w-full">
              <option value="">Select product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.productName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Product quantity</span>
            <input
              type="number"
              value={productAmount}
              onChange={e => setProductAmount(e.target.value)}
              placeholder="0"
              min="1"
              required
              className="mt-2 w-full"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              className="mt-2 w-full"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Payment method</span>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="mt-2 w-full">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile">Mobile</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Payment status</span>
            <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="mt-2 w-full">
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </label>

          <div className="flex items-end gap-3 lg:col-span-2">
            <button type="submit" className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
              {editId ? 'Update payment' : 'Create payment'}
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
          <p className="text-slate-600">Loading payments…</p>
        ) : payments.length === 0 ? (
          <p className="text-slate-600">No payment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Payment ID</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Customer</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Order</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Product</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Quantity</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Amount</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-900">{payment._id}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.CustomerID?.customerName || payment.CustomerID || '—'}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.OrderID?._id || payment.OrderID || '—'}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.productName?.productName || payment.productName || '—'}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.productAmount ?? '—'} <i>FRW</i></td>
                    <td className="px-4 py-4 text-slate-500">{payment.AmountPaid ?? '—'} <i>FRW</i></td>
                    <td className="px-4 py-4 text-slate-500">{payment.PaymentStatus || '—'}</td>
                    <td className="px-4 py-4 text-slate-500 space-x-2">
                      <button onClick={() => startEdit(payment)} className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(payment._id)} className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
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
