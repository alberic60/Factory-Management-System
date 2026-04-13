import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/reports/daily-sales');
        setReport(response.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Reports</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Daily sales</h1>
        </div>
      </div>
      {loading ? (
        <p className="text-slate-600">Loading report…</p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : report.length === 0 ? (
        <p className="text-slate-600">No report data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Date</th>
                <th className="px-4 py-3 font-medium text-slate-700">Sales total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.map(item => (
                <tr key={item._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-900">{item._id}</td>
                  <td className="px-4 py-4 text-slate-700">{item.totalSales ?? item.total ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
