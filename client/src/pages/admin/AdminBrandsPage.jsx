import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { Field, SelectField, TextArea, TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../lib/adminApi';

const emptyForm = {
  name: '',
  description: '',
  logo: '',
  website: '',
  status: 'active',
};

export default function AdminBrandsPage() {
  const { auth } = useApp();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.brands(auth.token);
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) loadData();
  }, [auth?.token]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const result = editingId
        ? await adminApi.updateBrand(auth.token, editingId, form)
        : await adminApi.createBrand(auth.token, form);

      if (result?._id || result?.id) {
        resetForm();
        await loadData();
      }
    } catch (err) {
      setError(err.message || 'Unable to save brand');
    } finally {
      setSaving(false);
    }
  };

  const editBrand = (brand) => {
    setEditingId(brand._id || brand.id);
    setForm({
      name: brand.name || '',
      description: brand.description || '',
      logo: brand.logo || '',
      website: brand.website || '',
      status: brand.status || 'active',
    });
  };

  const removeBrand = async (brand) => {
    if (!window.confirm(`Delete ${brand.name}?`)) return;
    try {
      setSaving(true);
      setError('');
      await adminApi.deleteBrand(auth.token, brand._id || brand.id);
      if (editingId === (brand._id || brand.id)) resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to delete brand');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageShell
      title="Brands"
      description="Manage manufacturer and label records used across the catalog."
      actions={<Button onClick={resetForm}>{editingId ? 'Cancel Edit' : 'New Brand'}</Button>}
    >
      {error ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-3xl font-semibold text-text">{editingId ? 'Edit Brand' : 'Add Brand'}</h2>
          <div className="mt-6 space-y-5">
            <Field label="Brand Name">
              <TextInput value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </Field>
            <Field label="Description">
              <TextArea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </Field>
            <Field label="Logo URL">
              <TextInput value={form.logo} onChange={(event) => setForm((current) => ({ ...current, logo: event.target.value }))} />
            </Field>
            <Field label="Website">
              <TextInput value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
            </Field>
            <Field label="Status">
              <SelectField value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SelectField>
            </Field>
          </div>
          <Button className="mt-6" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Brand' : 'Create Brand'}</Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading brands...</div> : null}
          {brands.map((brand) => (
            <div key={brand._id || brand.id} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{brand.slug}</p>
              <h3 className="mt-3 text-xl font-semibold text-text">{brand.name}</h3>
              <p className="mt-2 text-sm text-text/60">{brand.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-text/45">{brand.status}</p>
              <div className="mt-5 flex gap-2">
                <Button variant="ghost" className="px-4 py-2" onClick={() => editBrand(brand)}>Edit</Button>
                <Button variant="secondary" className="px-4 py-2" onClick={() => removeBrand(brand)}>Delete</Button>
              </div>
            </div>
          ))}
          {!brands.length && !loading ? <div className="rounded-3xl bg-white p-6 shadow-card">No brands found.</div> : null}
        </div>
      </div>
    </AdminPageShell>
  );
}
