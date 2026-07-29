import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminPageShell from '../../components/AdminPageShell';
import MetricCard from '../../components/MetricCard';
import Button from '../../components/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAdminSummary();
    fetchRevenueAnalytics();
    fetchAdminOrders();
  }, [fetchAdminSummary, fetchRevenueAnalytics, fetchAdminOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAdminSummary(),
      fetchRevenueAnalytics(),
      fetchAdminOrders()
    ]);
    setTimeout(() => setRefreshing(false), 500); // small delay for visual feedback
  };

  const recentOrders = adminOrders.slice(0, 5);

  const formattedRevenue = adminRevenue.map(item => ({
    name: `${monthNames[item.month - 1]} ${item.year}`,
    revenue: item.revenue
  }));

  return (
    <AdminPageShell
      title="Dashboard Overview"
      description="Track store health, revenue, orders, inventory, and the most important operational metrics."
      actions={
        <Button onClick={handleRefresh} disabled={adminLoading || refreshing} className="flex items-center gap-2">
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      }
    >
      {adminError ? (
        <div className="mb-6 flex items-center justify-between rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{adminError}</span>
          <Button onClick={handleRefresh} size="sm">Retry</Button>
        </div>
      ) : null}
      
      {adminLoading && !adminSummary ? (
        <div className="rounded-3xl bg-white p-6 shadow-card flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center text-text/50">
            <RefreshCw size={32} className="animate-spin mb-4 text-primary opacity-50" />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Revenue" value={formatCurrency(adminSummary?.revenue)} delta="Live data" icon={DollarSign} />
            <MetricCard label="Orders" value={adminSummary?.orders ?? 0} delta={`${adminSummary?.pendingOrders ?? 0} pending`} icon={ShoppingBag} />
            <MetricCard label="Customers" value={adminSummary?.customers ?? 0} delta="Registered users" icon={Users} />
            <MetricCard label="Low Stock" value={adminSummary?.lowStock ?? 0} delta="Inventory alert" icon={AlertCircle} />
          </div>
          
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-card flex flex-col border border-[#f2e6db]/50">
              <h2 className="font-display text-2xl font-semibold text-text">Revenue Trend</h2>
              <p className="mt-1 text-sm text-text/60 mb-6">Monthly revenue based on order totals over time.</p>
              
              <div className="flex-1 w-full min-h-[300px]">
                {formattedRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2e6db" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c6242' }} dy={10} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#8c6242' }}
                        tickFormatter={(value) => `Rs ${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                      />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                        formatter={(value) => [formatCurrency(value), 'Revenue']}
                        labelStyle={{ color: '#8c6242', fontWeight: 600, marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8c6242" 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8c6242' }}
                        activeDot={{ r: 6, fill: '#8c6242', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#f2e6db] rounded-2xl bg-[#fcfaf7]">
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#f2e6db] flex items-center justify-center text-primary/50">
                      <DollarSign size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-text mb-1">No sales data available yet</h3>
                    <p className="text-sm text-text/60 max-w-sm">Revenue trends will appear here once you start receiving orders.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rounded-3xl bg-white p-6 shadow-card border border-[#f2e6db]/50 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-text">Recent Orders</h2>
                  <p className="mt-1 text-sm text-text/60">Your latest 5 customer orders.</p>
                </div>
                {recentOrders.length > 0 && (
                  <Link to="/admin/orders" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-text transition-colors">
                    View All <ArrowRight size={16} />
                  </Link>
                )}
              </div>
              
              <div className="flex-1 overflow-x-auto">
                {recentOrders.length > 0 ? (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-black/5 text-[11px] uppercase tracking-wider text-text/50">
                        <th className="pb-3 font-semibold px-2">Order ID</th>
                        <th className="pb-3 font-semibold px-2">Customer</th>
                        <th className="pb-3 font-semibold px-2">Amount</th>
                        <th className="pb-3 font-semibold px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {recentOrders.map((order) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          key={order.id || order._id} 
                          className="hover:bg-[#fcfaf7] transition-colors"
                        >
                          <td className="py-4 px-2 font-medium text-text">#{String(order.id || order._id).slice(-6)}</td>
                          <td className="py-4 px-2">
                            <div className="flex flex-col">
                              <span className="text-text font-medium">{order.shippingAddress?.fullName || 'Guest'}</span>
                              <span className="text-[11px] text-text/50">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 font-semibold">{formatCurrency(order.totalPrice)}</td>
                          <td className="py-4 px-2 text-right">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              order.isPaid
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#f2e6db] rounded-2xl bg-[#fcfaf7]">
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#f2e6db] flex items-center justify-center text-primary/50">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-text mb-1">No recent orders</h3>
                    <p className="text-sm text-text/60 max-w-sm">When customers place orders, they will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
