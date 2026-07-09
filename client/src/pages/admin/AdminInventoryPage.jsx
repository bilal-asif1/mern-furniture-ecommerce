import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';

export default function AdminInventoryPage() {
  const { fetchInventoryOverview, adminInventory, updateProduct, adminLoading, adminError } = useApp();
  const [savingId, setSavingId] = useState('');
  const [stockMap, setStockMap] = useState({});

  useEffect(() => {
    fetchInventoryOverview();
  }, [fetchInventoryOverview]);

  useEffect(() => {
    const next = {};
    (adminInventory.products || []).forEach((item) => {
      next[item.id] = String(item.stock ?? 0);
    });
    setStockMap(next);
  }, [adminInventory.products]);

  const saveStock = async (product) => {
    try {
      setSavingId(product.id);
      await updateProduct(product.id, { stock: Number(stockMap[product.id] || 0) });
      fetchInventoryOverview();
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminPageShell title="Inventory" description="Track stock levels and highlight products that need replenishment.">
      {adminError ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{adminError}</div> : null}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Tracked Products</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{adminInventory.products?.length || 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Low Stock Items</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{adminInventory.lowStockCount || 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm text-text/60">Health Status</p>
          <p className="mt-3 font-display text-4xl font-semibold text-text">{(adminInventory.lowStockCount || 0) > 0 ? 'Watch' : 'Good'}</p>
        </div>
      </div>
      {adminLoading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading inventory...</div> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {(adminInventory.products || []).map((product) => (
          <div key={product.id} className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text">{product.name}</h3>
                <p className="text-sm text-text/60">{product.categoryName || 'Category not set'}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-[#f6efe8] text-primary'}`}>
                {product.stock <= 5 ? 'Low stock' : 'In stock'}
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <TextInput value={stockMap[product.id] || '0'} onChange={(event) => setStockMap((current) => ({ ...current, [product.id]: event.target.value }))} type="number" />
              <Button onClick={() => saveStock(product)} disabled={savingId === product.id}>
                {savingId === product.id ? 'Saving...' : 'Update Stock'}
              </Button>
            </div>
          </div>
        ))}
        {!adminInventory.products?.length && !adminLoading ? <div className="rounded-3xl bg-white p-6 shadow-card">No inventory data found.</div> : null}
      </div>
    </AdminPageShell>
  );
}
