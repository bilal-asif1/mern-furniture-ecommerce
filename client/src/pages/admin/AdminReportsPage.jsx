import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminPageShell from '../../components/AdminPageShell';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../lib/adminApi';

const currency = (value = 0) => `PKR ${Number(value).toLocaleString()}`;

const COLORS = ['#8b5e3c', '#c58d57', '#eadfce', '#a67c52', '#d4a574'];

export default function AdminReportsPage() {
  const { auth } = useApp();
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [summaryData, revenueData, ordersData, productsData] = await Promise.all([
          adminApi.summary(auth.token),
          adminApi.revenue(auth.token),
          adminApi.orders(auth.token),
          adminApi.products(auth.token, { limit: 200 }),
        ]);
        setSummary(summaryData);
        setRevenue(revenueData || []);
        setOrders(ordersData || []);
        setProducts(productsData?.products || []);
      } catch (err) {
        setError(err.message || 'Unable to load reports');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) load();
  }, [auth?.token]);

  // Compute analytics on frontend
  const analytics = useMemo(() => {
    if (!summary || !orders.length) return null;

    // Calculate top selling products
    const productSales = {};
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const productId = item.product?._id || item.product;
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            name: item.name,
            image: item.image || item.product?.images?.[0] || '',
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSales[productId].unitsSold += item.qty || 1;
        productSales[productId].revenue += (item.price || 0) * (item.qty || 1);
      });
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10)
      .map(product => ({
        ...product,
        stock: products.find(p => p._id === product.productId)?.stock || 0,
      }));

    // Calculate category revenue
    const categoryRevenue = {};
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const categoryName = item.product?.category?.name || 'Uncategorized';
        if (!categoryRevenue[categoryName]) {
          categoryRevenue[categoryName] = 0;
        }
        categoryRevenue[categoryName] += (item.price || 0) * (item.qty || 1);
      });
    });

    const categoryPerformance = Object.entries(categoryRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate sales overview
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Find best selling day
    const daySales = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const day = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
        if (!daySales[day]) daySales[day] = 0;
        daySales[day] += order.totalPrice || 0;
      }
    });
    const bestSellingDay = Object.entries(daySales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Find best selling month
    const monthSales = {};
    orders.forEach(order => {
      if (order.createdAt) {
        const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!monthSales[month]) monthSales[month] = 0;
        monthSales[month] += order.totalPrice || 0;
      }
    });
    const bestSellingMonth = Object.entries(monthSales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const bestSellingCategory = categoryPerformance[0]?.name || 'N/A';
    
    // Calculate total discount given
    let totalDiscount = 0;
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const product = products.find(p => p._id === (item.product?._id || item.product));
        if (product && product.discountPrice && product.discountPrice < product.price) {
          const discountPerUnit = product.price - product.discountPrice;
          totalDiscount += discountPerUnit * (item.qty || 1);
        }
      });
    });

    // Recent transactions
    const recentTransactions = orders.slice(0, 20).map(order => ({
      id: order._id,
      customer: order.user?.name || order.shippingAddress?.fullName || 'Guest',
      orderId: order._id?.toString().slice(-8).toUpperCase() || 'N/A',
      amount: order.totalPrice || 0,
      status: order.status || 'Pending',
      date: order.createdAt,
    }));

    // Monthly revenue for line chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyChart = revenue.map(item => ({
      month: monthNames[item.month - 1],
      year: item.year,
      revenue: item.revenue,
    }));

    return {
      summary: {
        totalRevenue: summary.revenue || 0,
        totalOrders: summary.orders || 0,
        totalCustomers: summary.customers || 0,
        totalProducts: summary.products || 0,
      },
      topSellingProducts,
      recentTransactions,
      categoryPerformance,
      salesOverview: {
        averageOrderValue,
        bestSellingDay,
        bestSellingMonth,
        bestSellingCategory,
        totalDiscount,
      },
      monthlyRevenue: monthlyChart,
      categoryRevenue: categoryPerformance,
    };
  }, [summary, orders, products]);

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminPageShell title="Reports" description="Analyze sales performance with revenue and operational summaries.">
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading reports...</div> : null}
      
      {analytics && (
        <>
          {/* Export Buttons */}
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
            {['PDF', 'Excel', 'CSV', 'Print'].map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format.toLowerCase())}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text/70 hover:bg-white/80 transition"
              >
                Export {format}
              </button>
            ))}
          </div>

          {/* KPI Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Revenue', value: currency(analytics.summary?.totalRevenue), icon: '💰', trend: '+12%' },
              { label: 'Total Orders', value: analytics.summary?.totalOrders || 0, icon: '📦', trend: '+8%' },
              { label: 'Total Customers', value: analytics.summary?.totalCustomers || 0, icon: '👥', trend: '+5%' },
              { label: 'Total Products', value: analytics.summary?.totalProducts || 0, icon: '🛋️', trend: '+2%' },
            ].map((card, index) => (
              <div key={card.label} className="rounded-3xl bg-white p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text/60">{card.label}</p>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <p className="mt-3 font-display text-4xl font-semibold text-text">{card.value}</p>
                <p className="mt-2 text-xs font-semibold text-green-600">{card.trend} vs last period</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Revenue Distribution by Category */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-text">Revenue by Category</h3>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryRevenue || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {(analytics.categoryRevenue || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Revenue Line Chart */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-text">Monthly Revenue</h3>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => currency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5e3c" strokeWidth={2} dot={{ fill: '#8b5e3c' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category Performance Horizontal Bar Chart */}
          <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
            <h3 className="font-display text-2xl font-semibold text-text">Category Performance</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryPerformance || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" width={100} stroke="#666" />
                  <Tooltip formatter={(value) => currency(value)} />
                  <Bar dataKey="revenue" fill="#8b5e3c" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Top Selling Products */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-text">Top Selling Products</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text/60">Product</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Units</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Revenue</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.topSellingProducts || []).map((product) => (
                      <tr key={product.productId} className="border-b border-black/5">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                            <span className="text-sm font-medium text-text">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-text">{product.unitsSold}</td>
                        <td className="py-3 text-right text-sm font-semibold text-text">{currency(product.revenue)}</td>
                        <td className="py-3 text-right text-sm text-text">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <h3 className="font-display text-2xl font-semibold text-text">Recent Transactions</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text/60">Customer</th>
                      <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text/60">Order ID</th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-text/60">Amount</th>
                      <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-text/60">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.recentTransactions || []).map((transaction) => (
                      <tr key={transaction.id} className="border-b border-black/5">
                        <td className="py-3 text-sm text-text">{transaction.customer}</td>
                        <td className="py-3 text-sm font-medium text-text">{transaction.orderId}</td>
                        <td className="py-3 text-right text-sm font-semibold text-text">{currency(transaction.amount)}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
            <h3 className="font-display text-2xl font-semibold text-text">Sales Overview</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Average Order Value', value: currency(analytics.salesOverview?.averageOrderValue) },
                { label: 'Best Selling Day', value: analytics.salesOverview?.bestSellingDay },
                { label: 'Best Selling Month', value: analytics.salesOverview?.bestSellingMonth },
                { label: 'Best Selling Category', value: analytics.salesOverview?.bestSellingCategory },
                { label: 'Total Discount Given', value: currency(analytics.salesOverview?.totalDiscount) },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-[#f7efe3] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text/60">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
