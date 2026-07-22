import { useEffect } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import MetricCard from '../../components/MetricCard';
import Button from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminDashboardPage() {
  const {
    fetchAdminSummary,
    fetchRevenueAnalytics,
    fetchAdminOrders,
    adminSummary,
    adminRevenue,
    adminOrders,
    adminLoading,
    adminError,
  } = useApp();

  useEffect(() => {
    fetchAdminSummary();
    fetchRevenueAnalytics();
    fetchAdminOrders();
  }, [fetchAdminSummary, fetchRevenueAnalytics, fetchAdminOrders]);

  const recentOrders = adminOrders.slice(0, 5);

  return (
    <AdminPageShell
      title="Dashboard Overview"
      description="Track store health, revenue, orders, inventory, and the most important operational metrics."
      actions={<Button onClick={() => window.location.reload()}>Refresh</Button>}
    >
      {adminError ? (
        <div className="mb-6 flex items-center justify-between rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{adminError}</span>
          <Button onClick={() => { fetchAdminSummary(); fetchRevenueAnalytics(); fetchAdminOrders(); }} size="sm">Retry</Button>
        </div>
      ) : null}
      {adminLoading ? (
        <div className="rounded-3xl bg-white p-6 shadow-card">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Revenue" value={formatCurrency(adminSummary?.revenue)} delta="Live data" />
            <MetricCard label="Orders" value={adminSummary?.orders ?? 0} delta={`${adminSummary?.pendingOrders ?? 0} pending`} />
            <MetricCard label="Customers" value={adminSummary?.customers ?? 0} delta="Registered users" />
            <MetricCard label="Low Stock" value={adminSummary?.lowStock ?? 0} delta="Inventory alert" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl font-semibold text-text">Revenue Trend</h2>
              <div className="mt-3 text-sm text-text/60">Monthly revenue based on order totals.</div>
              <div className="mt-8 flex h-72 items-end gap-3">
                {adminRevenue.length ? adminRevenue.map((entry) => {
                  const maxRevenue = Math.max(...adminRevenue.map((item) => item.revenue), 1);
                  const height = Math.max(12, Math.min(100, Math.round((entry.revenue / maxRevenue) * 100)));
                  return (
                    <div key={`${entry.year}-${entry.month}`} className="flex-1">
                      <div className="flex h-full flex-col justify-end">
                        <div className="mb-2 text-center text-xs font-semibold text-text/60">{formatCurrency(entry.revenue)}</div>
                        <div className="rounded-t-2xl bg-primary/80" style={{ height: `${height}%` }} />
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-sm text-text/60">No revenue data available yet.</div>
                )}
              </div>
            </div>
            <div className="rounded-3xl bg-[#eadfd2] p-6">
              <h2 className="font-display text-3xl font-semibold text-text">Recent Orders</h2>
              <div className="mt-6 space-y-4 text-sm text-text/70">
                {recentOrders.length ? recentOrders.map((order) => (
                  <div key={order.id || order._id} className="flex justify-between rounded-2xl bg-white/70 p-4">
                    <span>{String(order.id || order._id).slice(-6)}</span>
                    <span className="font-semibold text-text">{order.status || 'Pending'}</span>
                  </div>
                )) : <div className="rounded-2xl bg-white/70 p-4">No orders found.</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
