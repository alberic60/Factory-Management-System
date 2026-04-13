import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const clearForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setEditId(null);
    setEditName('');
    setEditPhone('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    try {
      if (editId) {
        await api.put(`/customers/${editId}`, {
          customerName: editName,
          phoneNumber: editPhone
        });
      } else {
        await api.post('/customers', {
          customerName,
          phoneNumber
        });
      }
      clearForm();
      loadCustomers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save customer.');
    }
  };

  const startEdit = customer => {
    setEditId(customer._id);
    setEditName(customer.customerName);
    setEditPhone(customer.phoneNumber);
  };

  const handleDelete = async id => {
    setError('');
    try {
      await api.delete(`/customers/${id}`);
      loadCustomers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete customer.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Customers</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Manage customers</h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-slate-700">Total: {customers.length}</div>
        </div>

        <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Customer name</span>
            <input
              value={editId ? editName : customerName}
              onChange={e => (editId ? setEditName(e.target.value) : setCustomerName(e.target.value))}
              placeholder="Enter customer name"
              required
              className="mt-2 w-full"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phone number</span>
            <input
              value={editId ? editPhone : phoneNumber}
              onChange={e => (editId ? setEditPhone(e.target.value) : setPhoneNumber(e.target.value))}
              placeholder="Enter phone number"
              required
              className="mt-2 w-full"
            />
          </label>

          <div className="flex items-end gap-3">
            <button type="submit" className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600">
              {editId ? 'Update customer' : 'Add customer'}
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
          <p className="text-slate-600">Loading customers…</p>
        ) : customers.length === 0 ? (
          <p className="text-slate-600">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Phone</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {customers.map(customer => (
                  <tr key={customer._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-900">{customer.customerName}</td>
                    <td className="px-4 py-4 text-slate-700">{customer.phoneNumber}</td>
                    <td className="px-4 py-4 text-slate-500 space-x-2">
                      <button onClick={() => startEdit(customer)} className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(customer._id)} className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
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
