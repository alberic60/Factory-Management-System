import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    productCount: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes, ordersRes, paymentsRes] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders'),
          api.get('/payments')
        ]);

        const products = productsRes.data || [];
        const customers = customersRes.data || [];
        const orders = ordersRes.data || [];
        const payments = paymentsRes.data || [];

        // Calculate total inventory value
        const totalProducts = products.reduce((sum, p) => sum + (p.productAmount * p.unitPrice), 0);

        // Find low stock products (less than 10 units)
        const lowStockProducts = products.filter(p => p.productAmount < 10);

        // Calculate total revenue from payments
        const totalRevenue = payments.reduce((sum, p) => sum + (p.AmountPaid || 0), 0);

        setStats({
          totalProducts: totalProducts.toFixed(2),
          productCount: products.length,
          totalCustomers: customers.length,
          totalOrders: orders.length,
          totalRevenue: totalRevenue.toFixed(2),
          lowStockProducts: lowStockProducts.slice(0, 5)
        });

        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Loading dashboard…</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome to FOSMS</h1>
          <p className="mt-2 text-slate-600">Fast Order Store Management System - Manage inventory, orders, and sales efficiently</p>
        </div>

        {error && <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div 
            onClick={() => navigate('/products')}
            className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 cursor-pointer transition hover:shadow-lg hover:from-blue-100 hover:to-blue-150"
          >
            <h3 className="text-sm font-medium text-blue-600 uppercase">Total Products</h3>
            <p className="mt-3 text-3xl font-bold text-blue-900">{stats.productCount}</p>
            <p className="mt-1 text-sm text-blue-700">Inventory value: {stats.totalProducts} <i>FRW</i></p>
            <p className="text-xs text-blue-600 mt-2 hover:underline">View products →</p>
          </div>

          <div 
            onClick={() => navigate('/customers')}
            className="rounded-3xl border border-slate-200 bg-gradient-to-br from-green-50 to-green-100 p-6 cursor-pointer transition hover:shadow-lg hover:from-green-100 hover:to-green-150"
          >
            <h3 className="text-sm font-medium text-green-600 uppercase">Customers</h3>
            <p className="mt-3 text-3xl font-bold text-green-900">{stats.totalCustomers}</p>
            <p className="mt-1 text-sm text-green-700">Active customer base</p>
            <p className="text-xs text-green-600 mt-2 hover:underline">View customers →</p>
          </div>

          <div 
            onClick={() => navigate('/orders')}
            className="rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 cursor-pointer transition hover:shadow-lg hover:from-purple-100 hover:to-purple-150"
          >
            <h3 className="text-sm font-medium text-purple-600 uppercase">Orders</h3>
            <p className="mt-3 text-3xl font-bold text-purple-900">{stats.totalOrders}</p>
            <p className="mt-1 text-sm text-purple-700">Total orders placed</p>
            <p className="text-xs text-purple-600 mt-2 hover:underline">View orders →</p>
          </div>

          <div 
            onClick={() => navigate('/payments')}
            className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 to-amber-100 p-6 cursor-pointer transition hover:shadow-lg hover:from-amber-100 hover:to-amber-150"
          >
            <h3 className="text-sm font-medium text-amber-600 uppercase">Revenue</h3>
            <p className="mt-3 text-3xl font-bold text-amber-900">{stats.totalRevenue} <i>FRW</i></p>
            <p className="mt-1 text-sm text-amber-700">Total payments received</p>
            <p className="text-xs text-amber-600 mt-2 hover:underline">View payments →</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-red-900">⚠️ Low Stock Alert</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {stats.lowStockProducts.map(product => (
                <div key={product._id} className="rounded-lg bg-white p-4 border border-red-100">
                  <p className="font-medium text-slate-900">{product.productName}</p>
                  <p className="text-sm text-red-600 mt-1">Stock: {product.productAmount} units</p>
                  <p className="text-xs text-slate-500 mt-1">Price: {product.unitPrice} <i>FRW</i></p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Manage inventory
            </button>
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div 
          onClick={() => navigate('/products')}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-blue-600">📦 Inventory</h2>
          <p className="mt-2 text-slate-600">Track products, stock levels, and supplier details in one place.</p>
          <button className="mt-4 text-sm font-semibold text-blue-600 hover:underline">
            Manage inventory →
          </button>
        </div>

        <div 
          onClick={() => navigate('/orders')}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-purple-600">📊 Sales</h2>
          <p className="mt-2 text-slate-600">Monitor orders, payments, and daily sales figures with live updates.</p>
          <button className="mt-4 text-sm font-semibold text-purple-600 hover:underline">
            View sales →
          </button>
        </div>

        <div 
          onClick={() => navigate('/customers')}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-green-600">👥 Customer Care</h2>
          <p className="mt-2 text-slate-600">Manage customers, invoices, and service interactions centrally.</p>
          <button className="mt-4 text-sm font-semibold text-green-600 hover:underline">
            View customers →
          </button>
        </div>
      </div>
    </section>
  );
}
