import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../lib/adminApi';

const currency = (value = 0) => `$${Number(value).toLocaleString()}`;

export default function AdminReportsPage() {
  const { auth } = useApp();
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [summaryData, revenueData] = await Promise.all([
          adminApi.summary(auth.token),
          adminApi.revenue(auth.token),
        ]);
        setSummary(summaryData);
        setRevenue(revenueData || []);
      } catch (err) {
        setError(err.message || 'Unable to load reports');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) load();
  }, [auth?.token]);

  const maxRevenue = Math.max(...revenue.map((item) => item.revenue), 1);

  return (
    <AdminPageShell title="Reports" description="Analyze sales performance with revenue and operational summaries.">
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading reports...</div> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Revenue</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{currency(summary?.revenue)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Orders</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{summary?.orders ?? 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Customers</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{summary?.customers ?? 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Products</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{summary?.products ?? 0}</p>
        </div>
      </div>
      <div className="mt-6 rounded-3xl bg-[#eadfd2] p-6">
        <h2 className="font-display text-3xl font-semibold text-text">Revenue Distribution</h2>
        <div className="mt-2 text-sm text-text/60">Monthly totals from backend analytics.</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {revenue.length ? revenue.map((item) => (
            <div key={`${item.year}-${item.month}`} className="rounded-2xl bg-white/65 p-4">
              <p className="text-sm font-semibold text-text">{item.month}/{item.year}</p>
              <p className="mt-1 text-sm text-text/60">{currency(item.revenue)} | {item.orders} orders</p>
              <div className="mt-4 h-32 rounded-xl bg-black/5">
                <div className="h-full rounded-xl bg-primary/80" style={{ width: `${Math.max(12, (item.revenue / maxRevenue) * 100)}%` }} />
              </div>
            </div>
          )) : <div className="rounded-2xl bg-white/65 p-4">No report data available.</div>}
        </div>
      </div>
    </AdminPageShell>
  );
}
