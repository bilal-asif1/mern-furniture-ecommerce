import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import { Field, TextInput } from '../components/Field';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const steps = ['Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusIndex = (status = '') => {
  const normalized = String(status).toLowerCase();
  if (normalized.includes('deliver')) return 4;
  if (normalized.includes('out')) return 3;
  if (normalized.includes('ship')) return 2;
  if (normalized.includes('process') || normalized.includes('pack')) return 1;
  return 0;
};

export default function OrderTrackingPage() {
  const location = useLocation();
  const { order, fetchOrderById, orderLoading, orderError } = useApp();
  const [orderId, setOrderId] = useState(location.state?.orderId || '');

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  const current = order || {};

  return (
    <PageSection className="py-10">
      <SectionTitle eyebrow="Tracking" title="Track Your Order" description="Look up an order by ID without signing in, then follow its fulfillment status." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-card">
          <Field label="Order Number">
            <TextInput value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Paste your order ID" />
          </Field>
          <Button className="mt-5" onClick={() => fetchOrderById(orderId)} disabled={!orderId || orderLoading}>
            {orderLoading ? 'Tracking...' : 'Track Order'}
          </Button>
          {orderError ? <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{orderError}</div> : null}
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-[#f5ede5] p-4">
              <p className="text-sm font-semibold text-text">Current Status</p>
              <p className="mt-1 text-2xl font-display text-primary">{current.status || 'Waiting for tracking number'}</p>
            </div>
            <div className="rounded-2xl bg-[#f5ede5] p-4">
              <p className="text-sm font-semibold text-text">Order Date</p>
              <p className="mt-1 text-lg text-text/70">{current.createdAt ? new Date(current.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-card">
          <h3 className="font-display text-3xl font-semibold text-text">Fulfillment Timeline</h3>
          <div className="mt-8 space-y-5">
            {steps.map((step, index) => {
              const active = index <= statusIndex(current.status);
              return (
                <div key={step} className="flex items-center gap-4">
                  <div className={`h-4 w-4 rounded-full ${active ? 'bg-primary' : 'bg-black/10'}`} />
                  <div className="flex-1">
                    <p className={`font-semibold ${active ? 'text-text' : 'text-text/50'}`}>{step}</p>
                    <div className="mt-2 h-2 rounded-full bg-black/5">
                      <div className={`h-full rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} style={{ width: active ? '100%' : '0%' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageSection>
  );
}
