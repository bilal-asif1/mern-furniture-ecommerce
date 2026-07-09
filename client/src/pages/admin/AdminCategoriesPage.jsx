import { useEffect, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { Field, TextArea, TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';

const emptyForm = {
  name: '',
  description: '',
  image: '',
};

export default function AdminCategoriesPage() {
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    categoriesLoading,
    catalogError,
    catalogSuccess,
  } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const result = editingId ? await updateCategory(editingId, form) : await createCategory(form);
      if (result.meta.requestStatus === 'fulfilled') {
        resetForm();
        fetchCategories();
      }
    } finally {
      setSaving(false);
    }
  };

  const editCategory = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
    });
  };

  const removeCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <AdminPageShell
      title="Categories"
      description="Create and organize product categories for smoother store navigation."
      actions={<Button onClick={resetForm}>{editingId ? 'Cancel Edit' : 'New Category'}</Button>}
    >
      {catalogError ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{catalogError}</div> : null}
      {catalogSuccess ? <div className="mb-4 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{catalogSuccess}</div> : null}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-3xl font-semibold text-text">{editingId ? 'Edit Category' : 'Add Category'}</h2>
          <div className="mt-6 space-y-5">
            <Field label="Category Name"><TextInput value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></Field>
            <Field label="Description"><TextArea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></Field>
            <Field label="Image URL"><TextInput value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} /></Field>
          </div>
          <Button className="mt-6" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}</Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {categoriesLoading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading categories...</div> : null}
          {categories.map((category) => (
            <div key={category.id} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{category.slug}</p>
              <h3 className="mt-3 text-xl font-semibold text-text">{category.name}</h3>
              <p className="mt-2 text-sm text-text/60">{category.description}</p>
              <div className="mt-5 flex gap-2">
                <Button variant="ghost" className="px-4 py-2" onClick={() => editCategory(category)}>Edit</Button>
                <Button variant="secondary" className="px-4 py-2" onClick={() => removeCategory(category.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
