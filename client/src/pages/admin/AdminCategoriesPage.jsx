import { useMemo, useRef, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { Field, SelectField, TextArea, TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';

const PLACEHOLDER_IMAGE = '/category-placeholder.svg';
const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  image: '',
  status: 'active',
  removeImage: false,
};

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.readAsDataURL(file);
  });

export default function AdminCategoriesPage() {
  const {
    categories,
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
  const [formError, setFormError] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const fileInputRef = useRef(null);

  const previewImage = useMemo(
    () => (form.removeImage ? PLACEHOLDER_IMAGE : form.image || PLACEHOLDER_IMAGE),
    [form.image, form.removeImage],
  );

  const previewAlt = useMemo(
    () => form.name || 'Category preview',
    [form.name],
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
    setSlugTouched(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === 'name' && !slugTouched) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormError('Please upload a JPG, PNG, or WEBP image.');
      event.target.value = '';
      return;
    }

    const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setFormError(`Image size must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      event.target.value = '';
      return;
    }

    try {
      setFormError('');
      const dataUrl = await readFileAsDataUrl(file);
      setForm((current) => ({
        ...current,
        image: dataUrl,
        removeImage: false,
      }));
    } catch (error) {
      setFormError(error.message || 'Unable to preview the selected image.');
    }
  };

  const clearImage = () => {
    setForm((current) => ({
      ...current,
      image: '',
      removeImage: true,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setFormError('');

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        image: form.image,
        status: form.status,
        removeImage: form.removeImage,
      };

      const result = editingId
        ? await updateCategory(editingId, payload)
        : await createCategory(payload);

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
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      status: category.status || 'active',
      removeImage: false,
    });
    setSlugTouched(false);
    setFormError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <AdminPageShell
      title="Categories"
      description="Manage category images, slugs, and display status from one premium admin workflow."
      actions={<Button onClick={resetForm}>{editingId ? 'Cancel Edit' : 'New Category'}</Button>}
    >
      {catalogError ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{catalogError}</div> : null}
      {catalogSuccess ? <div className="mb-4 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{catalogSuccess}</div> : null}
      {formError ? <div className="mb-4 rounded-3xl bg-amber-50 px-5 py-4 text-sm text-amber-800">{formError}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={submit} className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(86,58,36,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-text">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <p className="mt-2 text-sm leading-6 text-text/60">
                Upload, replace, or remove a category image without leaving the category editor.
              </p>
            </div>
            <span className="rounded-full bg-[#f7efe3] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {form.status}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <Field label="Category Name">
              <TextInput
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="Dining Set"
              />
            </Field>

            <Field label="Slug" hint="Editable and URL-safe.">
              <TextInput
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField('slug', slugify(event.target.value));
                }}
                placeholder="dining-set"
              />
            </Field>

            <Field label="Description">
              <TextArea
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                placeholder="Short category description..."
              />
            </Field>

            <Field label="Category Image" hint={`JPG, PNG, WEBP. Max ${MAX_IMAGE_SIZE_MB}MB.`}>
              <div className="rounded-2xl border border-dashed border-black/15 bg-[#fcfaf7] p-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#eadfce] bg-[#f7efe6] shadow-[0_12px_30px_rgba(86,58,36,0.08)]">
                    <img
                      src={previewImage}
                      alt={previewAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        if (e.target.src !== PLACEHOLDER_IMAGE) {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="block w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-text/70 file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" variant="ghost" className="px-4 py-2 text-sm" onClick={clearImage}>
                        Remove Image
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="px-4 py-2 text-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Replace Image
                      </Button>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-text/50">
                      The selected file will be uploaded when you save the category.
                    </p>
                  </div>
                </div>
              </div>
            </Field>

            <Field label="Status">
              <SelectField value={form.status} onChange={(event) => setField('status', event.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SelectField>
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-black/5 pt-6">
            <Button className="min-w-36" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
            </Button>
            {editingId ? (
              <Button variant="ghost" type="button" onClick={resetForm}>
                Clear Form
              </Button>
            ) : null}
          </div>
        </form>

        <div>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Category Cards</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-text">Luxury category inventory</h3>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text/60 shadow-[0_10px_30px_rgba(86,58,36,0.06)]">
              {categories.length} categories
            </span>
          </div>

          {categoriesLoading ? (
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_16px_45px_rgba(86,58,36,0.08)]">
              Loading categories...
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const isInactive = category.status === 'inactive';
              const image = category.image || PLACEHOLDER_IMAGE;

              return (
                <div
                  key={category.id}
                  className="group overflow-hidden rounded-[2rem] border border-white/75 bg-white/90 shadow-[0_16px_45px_rgba(86,58,36,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(86,58,36,0.12)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f7efe6]">
                    <img
                      src={image}
                      alt={category.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute left-4 top-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          isInactive ? 'bg-black/75 text-white' : 'bg-white/90 text-primary'
                        }`}
                      >
                        {isInactive ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/70">
                          {category.slug}
                        </p>
                        <h4 className="mt-2 font-display text-2xl font-semibold text-text">{category.name}</h4>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-text/60">
                      {category.description || 'No description added yet.'}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <Button variant="ghost" className="flex-1 px-4 py-2" onClick={() => editCategory(category)}>
                        Edit
                      </Button>
                      <Button variant="secondary" className="flex-1 px-4 py-2" onClick={() => removeCategory(category.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!categoriesLoading && !categories.length ? (
              <div className="rounded-[2rem] border border-dashed border-[#e0d2c0] bg-white/70 p-8 text-sm text-text/55">
                No categories found. Create the first category to begin managing images.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
