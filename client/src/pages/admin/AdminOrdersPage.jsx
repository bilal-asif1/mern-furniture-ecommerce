import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { SelectField } from '../../components/Field';
import { useApp } from '../../context/AppContext';
import { orderApi } from '../../lib/adminApi';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { auth } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');
  const [statusMap, setStatusMap] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderApi.list(auth.token);
      setOrders(Array.isArray(data) ? data : []);
      const next = {};
      (Array.isArray(data) ? data : []).forEach((order) => {
        next[order._id] = order.status || 'Pending';
      });
      setStatusMap(next);
    } catch (err) {
      setError(err.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) loadData();
  }, [auth?.token]);

  const updateStatus = async (id) => {
    try {
      setSavingId(id);
      setError('');
      await orderApi.update(auth.token, id, { status: statusMap[id] });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update order');
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminPageShell title="Orders" description="Review order status, fulfillment progress, and customer purchase history.">
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading orders...</div> : null}
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text">{order._id}</h3>
              <p className="text-sm text-text/60">{new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 text-sm text-text/70">{order.user?.name || 'Customer'} | {order.user?.email || 'N/A'}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px] lg:items-center">
              <div className="rounded-2xl bg-[#f6efe8] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-text/50">Total</p>
                <p className="mt-1 font-semibold text-text">${order.totalPrice}</p>
              </div>
              <SelectField value={statusMap[order._id] || order.status} onChange={(event) => setStatusMap((current) => ({ ...current, [order._id]: event.target.value }))}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </SelectField>
              <Button onClick={() => updateStatus(order._id)} disabled={savingId === order._id}>
                {savingId === order._id ? 'Saving...' : 'Save Status'}
              </Button>
            </div>
          </div>
        ))}
        {!orders.length && !loading ? <div className="rounded-3xl bg-white p-6 shadow-card">No orders found.</div> : null}
      </div>
    </AdminPageShell>
  );
}
