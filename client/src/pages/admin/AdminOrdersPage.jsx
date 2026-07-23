import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { SelectField } from '../../components/Field';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../lib/adminApi';
import { formatCurrency } from '../../utils/formatCurrency';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const formatOrderId = (id) => {
  if (!id) return 'Order #UNKNOWN';
  const shortId = id.slice(-6).toUpperCase();
  return `Order #${shortId}`;
};

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;
  const deliveryInstructions = (order.orderNotes || '').trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-semibold text-text">Order Details</h2>
          <button onClick={onClose} className="rounded-full bg-black/5 p-2 hover:bg-black/10 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text/50 font-semibold mb-2">Customer Info</h3>
            <p className="text-sm font-semibold text-text">{order.user ? (order.user.name || order.shippingAddress?.fullName) : (order.shippingAddress?.fullName || 'Guest Customer')}</p>
            {!order.user && <p className="text-xs text-primary font-medium">Guest Checkout</p>}
            <p className="text-sm text-text/70 mt-1">{order.shippingAddress?.email || 'N/A'}</p>
            <p className="text-sm text-text/70">{order.shippingAddress?.phone || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text/50 font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm text-text/70">{order.shippingAddress?.address || 'N/A'}</p>
            <p className="text-sm text-text/70">{order.shippingAddress?.city || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text/50 font-semibold mb-2">Order Info</h3>
            <p className="text-sm text-text/70">Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
            <p className="text-sm text-text/70">Payment Method: {order.paymentMethod}</p>
            <p className="text-sm font-semibold mt-1">
              Payment Status: <span className={order.isPaid ? 'text-green-600' : 'text-amber-600'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-black/5 bg-[#fbf7f2] p-5">
          <h3 className="text-xs uppercase tracking-widest text-text/50 font-semibold mb-2">Delivery Instructions</h3>
          <p className="text-sm leading-7 text-text/80 whitespace-pre-wrap break-words">
            {deliveryInstructions || 'No delivery instructions provided.'}
          </p>
        </div>

        <h3 className="text-xs uppercase tracking-widest text-text/50 font-semibold mb-4 border-b border-black/5 pb-2">Order Items</h3>
        <div className="flex flex-col gap-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f6efe8]">
                {item.image ? (
                  <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-text/30">No Img</div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">{item.name}</p>
                <p className="text-xs text-text/60">Qty: {item.qty} × {formatCurrency(item.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text">{formatCurrency(item.price * item.qty)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { auth } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');
  const [statusMap, setStatusMap] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.orders(auth.token);
      console.log('=== ADMIN ORDERS PAGE DEBUG ===');
      console.log('Raw API response:', data);
      let fetchedOrders = Array.isArray(data) ? data : [];
      console.log('Orders array length:', fetchedOrders.length);
      if (fetchedOrders.length > 0) {
        console.log('First order orderNotes:', fetchedOrders[0].orderNotes);
        console.log('First order full object:', JSON.stringify(fetchedOrders[0], null, 2));
      }
      fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(fetchedOrders);
      const next = {};
      fetchedOrders.forEach((order) => {
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
      // Use original logic if available, assuming orderApi is available or adminApi.updateOrder
      // Wait, original AdminOrdersPage used `orderApi.update`, which was not imported!
      // Let's use fetch directly since it was missing in the original file actually, or I can check.
      // Ah, original file had `await orderApi.update(auth.token, id, { status: statusMap[id] });` but orderApi was not imported! Let's use standard fetch to be safe.
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ status: statusMap[id] })
      });
      if (!res.ok) throw new Error('Failed to update order');
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
          <div key={order._id} className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-text">{formatOrderId(order._id)}</h3>
                <span className="text-xs text-text/40 font-mono">{order._id}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                <div>
                  <p className="text-xs text-text/50 uppercase tracking-wider font-semibold">Date</p>
                  <p className="text-sm text-text/80">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div>
                  <p className="text-xs text-text/50 uppercase tracking-wider font-semibold">Customer</p>
                  <p className="text-sm font-medium text-text">
                    {order.user ? (order.user.name || order.shippingAddress?.fullName) : (order.shippingAddress?.fullName || 'Guest Customer')}
                  </p>
                  {!order.user && <span className="text-[10px] font-bold text-primary uppercase">Guest</span>}
                </div>
                <div>
                  <p className="text-xs text-text/50 uppercase tracking-wider font-semibold">Payment</p>
                  <p className="text-sm text-text/80">{order.paymentMethod} • <span className={order.isPaid ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></p>
                </div>
                <div className="col-span-2 md:col-span-3 mt-2">
                  <p className="text-xs text-text/50 uppercase tracking-wider font-semibold mb-2">Items ({order.orderItems?.length || 0})</p>
                  {order.orderItems?.length > 0 ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#f8f9fa] p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
                          {order.orderItems[0].image ? (
                            <img src={order.orderItems[0].image.startsWith('http') ? order.orderItems[0].image : `http://localhost:5000${order.orderItems[0].image}`} alt={order.orderItems[0].name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-text/30">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text line-clamp-1">{order.orderItems[0].name}</p>
                          <p className="text-xs text-text/60">Qty: {order.orderItems[0].qty} × {formatCurrency(order.orderItems[0].price)}</p>
                        </div>
                      </div>
                      {order.orderItems.length > 1 && (
                        <div className="ml-4 shrink-0">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            +{order.orderItems.length - 1} more items
                          </Button>
                        </div>
                      )}
                      {order.orderItems.length === 1 && (
                        <div className="ml-4 shrink-0">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-text/50">No items found.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:w-auto lg:min-w-[420px] lg:items-center shrink-0">
              <div className="rounded-2xl bg-[#f6efe8] px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-text/50">Total</p>
                <p className="mt-1 font-semibold text-text">{formatCurrency(order.totalPrice)}</p>
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
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </AdminPageShell>
  );
}
