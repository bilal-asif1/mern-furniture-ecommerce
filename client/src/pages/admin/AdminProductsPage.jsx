import { useEffect, useMemo, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import { Field, SelectField, TextArea, TextInput } from '../../components/Field';
import { useApp } from '../../context/AppContext';

const createId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const blankImage = (value = '') => ({
  id: createId(),
  value,
});

const emptyForm = {
  name: '',
  category: '',
  brand: 'Junaid Furniture',
  sku: '',
  description: '',
  shortDescription: '',
  material: '',
  color: '',
  dimensions: { width: '', height: '', depth: '' },
  weight: '',
  warranty: '',
  price: '',
  discountPrice: '',
  discountPercentage: '',
  stock: '',
  featured: false,
  bestSeller: false,
  newArrival: false,
  productStatus: 'active',
  tags: '',
  badges: '',
  images: [],
  thumbnailImage: '',
  removedImages: [],
};

const toCommaString = (items = []) => items.filter(Boolean).join(', ');

const toImagePayload = (items = []) => items.map((item) => item.value).filter(Boolean);

const buildProductPayload = (form, { categoryFallback = '', brandFallback = 'Junaid Furniture' } = {}) => {
  const imageValues = toImagePayload(form.images);
  const thumbnailImage = form.thumbnailImage || imageValues[0] || '';

  return {
    name: form.name.trim(),
    category: form.category || categoryFallback,
    brand: form.brand.trim() || brandFallback,
    sku: form.sku.trim(),
    description: form.description.trim(),
    shortDescription: form.shortDescription.trim(),
    material: form.material.trim(),
    color: form.color.trim(),
    dimensions: {
      width: form.dimensions.width,
      height: form.dimensions.height,
      depth: form.dimensions.depth,
    },
    weight: form.weight,
    warranty: form.warranty.trim(),
    price: form.price,
    discountPrice: form.discountPrice,
    discountPercentage: form.discountPercentage || calculateDiscountPercentage(form.price, form.discountPrice),
    stock: form.stock,
    featured: form.featured,
    bestSeller: form.bestSeller,
    newArrival: form.newArrival,
    productStatus: form.productStatus,
    tags: form.tags,
    badges: form.badges,
    thumbnailImage,
    images: imageValues,
    removedImages: form.removedImages,
  };
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.readAsDataURL(file);
  });

const calculateDiscountPercentage = (price, discountPrice) => {
  const currentPrice = Number(price);
  const discountedPrice = Number(discountPrice);
  if (!currentPrice || !discountedPrice || discountedPrice >= currentPrice) return '';
  return String(Math.round(((currentPrice - discountedPrice) / currentPrice) * 100));
};

export default function AdminProductsPage() {
  const {
    adminProducts,
    categories,
    brands,
    brandsLoading,
    fetchAdminProducts,
    fetchCategories,
    fetchBrands,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    toggleProductStatus,
    adminCatalogLoading,
    catalogError,
    catalogSuccess,
  } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminProducts({ limit: 200 });
    fetchCategories();
    fetchBrands();
  }, [fetchAdminProducts, fetchCategories, fetchBrands]);

  useEffect(() => {
    if (!form.category && categories[0]?.id) {
      setForm((current) => ({ ...current, category: categories[0].id }));
    }
  }, [categories, form.category]);

  useEffect(() => {
    if (!form.brand && brands[0]?.name) {
      setForm((current) => ({ ...current, brand: brands[0].name }));
    }
  }, [brands, form.brand]);

  const brandOptions = useMemo(() => {
    const values = brands.map((brand) => brand.name).filter(Boolean);
    if (form.brand && !values.includes(form.brand)) {
      values.unshift(form.brand);
    }
    if (!values.length) {
      values.push('Junaid Furniture');
    }
    return Array.from(new Set(values));
  }, [brands, form.brand]);

  const resetForm = () => {
    setForm({
      ...emptyForm,
      category: categories[0]?.id || '',
      brand: brands[0]?.name || 'Junaid Furniture',
    });
    setEditingId(null);
  };

  const effectiveThumbnail = useMemo(
    () => form.thumbnailImage || form.images[0]?.value || '',
    [form.images, form.thumbnailImage],
  );

  const removeImage = (index) => {
    setForm((current) => {
      const nextImages = [...current.images];
      const [removed] = nextImages.splice(index, 1);
      const removedValue = removed?.value || '';
      const nextRemovedImages = removedValue && !removedValue.startsWith('data:')
        ? current.removedImages.includes(removedValue)
          ? current.removedImages
          : [...current.removedImages, removedValue]
        : current.removedImages;
      const nextThumbnail = current.thumbnailImage === removedValue ? nextImages[0]?.value || '' : current.thumbnailImage;

      return {
        ...current,
        images: nextImages,
        thumbnailImage: nextThumbnail,
        removedImages: nextRemovedImages,
      };
    });
  };

  const replaceImage = async (index, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setForm((current) => {
      const nextImages = [...current.images];
      const previousValue = nextImages[index]?.value || '';
      nextImages[index] = blankImage(dataUrl);
      const nextRemovedImages = previousValue && !previousValue.startsWith('data:')
        ? current.removedImages.includes(previousValue)
          ? current.removedImages
          : [...current.removedImages, previousValue]
        : current.removedImages;

      return {
        ...current,
        images: nextImages,
        removedImages: nextRemovedImages,
      };
    });
  };

  const addImages = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;
    const newImages = await Promise.all(selectedFiles.map(async (file) => blankImage(await readFileAsDataUrl(file))));
    setForm((current) => ({
      ...current,
      images: [...current.images, ...newImages],
    }));
  };

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setDimension = (key, value) => setForm((current) => ({ ...current, dimensions: { ...current.dimensions, [key]: value } }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = buildProductPayload(form, {
        categoryFallback: categories[0]?.id || '',
        brandFallback: brands[0]?.name || 'Junaid Furniture',
      });
      const action = editingId
        ? updateProduct(editingId, payload)
        : createProduct(payload);

      await action.unwrap();
      resetForm();
      await fetchAdminProducts({ limit: 200 });
    } catch (_error) {
      // The catalog slice already records a user-facing error message.
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      category: product.categoryId || '',
      brand: product.brand || 'Junaid Furniture',
      sku: product.sku || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      material: product.material || '',
      color: product.color || '',
      dimensions: {
        width: product.dimensions?.width ?? '',
        height: product.dimensions?.height ?? '',
        depth: product.dimensions?.depth ?? '',
      },
      weight: product.weight ?? '',
      warranty: product.warranty || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      discountPercentage: product.discountPercentage ?? '',
      stock: product.stock ?? '',
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
      newArrival: Boolean(product.newArrival),
      productStatus: product.productStatus || 'active',
      tags: toCommaString(product.tags || []),
      badges: toCommaString(product.badges || []),
      images: (product.images || []).map((item) => blankImage(item)),
      thumbnailImage: product.thumbnailImage || product.images?.[0] || '',
      removedImages: [],
    });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(product.isDeleted ? 'Restore this product?' : 'Move this product to trash?')) return;
    if (product.isDeleted) {
      await restoreProduct(product.id);
    } else {
      await deleteProduct(product.id);
    }
    fetchAdminProducts({ limit: 200 });
  };

  const handleStatusToggle = async (product) => {
    await toggleProductStatus(product.id);
    fetchAdminProducts({ limit: 200 });
  };

  return (
    <AdminPageShell
      title="Products"
      description="Manage catalog items, pricing, lifecycle status, and rich product media."
      actions={<Button onClick={resetForm}>{editingId ? 'Cancel Edit' : 'New Product'}</Button>}
    >
      {catalogError ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{catalogError}</div> : null}
      {catalogSuccess ? <div className="mb-4 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{catalogSuccess}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-text">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
            <span className="rounded-full bg-[#f7efe3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {effectiveThumbnail ? 'Media ready' : 'No thumbnail'}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Product Name"><TextInput value={form.name} onChange={(event) => setField('name', event.target.value)} /></Field>
              <Field label="SKU"><TextInput value={form.sku} onChange={(event) => setField('sku', event.target.value)} /></Field>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Category">
                <SelectField value={form.category} onChange={(event) => setField('category', event.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </SelectField>
              </Field>
              <Field label="Brand" hint={brandsLoading ? 'Loading brands...' : 'Selected from existing brands'}>
                <SelectField value={form.brand} onChange={(event) => setField('brand', event.target.value)}>
                  {brandOptions.map((brandName) => (
                    <option key={brandName} value={brandName}>{brandName}</option>
                  ))}
                </SelectField>
              </Field>
            </div>
            <Field label="Short Description"><TextArea rows={3} value={form.shortDescription} onChange={(event) => setField('shortDescription', event.target.value)} /></Field>
            <Field label="Description"><TextArea rows={5} value={form.description} onChange={(event) => setField('description', event.target.value)} /></Field>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Price (PKR)"><TextInput type="number" value={form.price} onChange={(event) => setField('price', event.target.value)} /></Field>
              <Field label="Discount Price"><TextInput type="number" value={form.discountPrice} onChange={(event) => setField('discountPrice', event.target.value)} /></Field>
              <Field label="Discount %"><TextInput type="number" value={form.discountPercentage} onChange={(event) => setField('discountPercentage', event.target.value)} /></Field>
              <Field label="Stock Qty"><TextInput type="number" value={form.stock} onChange={(event) => setField('stock', event.target.value)} /></Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Material"><TextInput value={form.material} onChange={(event) => setField('material', event.target.value)} /></Field>
              <Field label="Color"><TextInput value={form.color} onChange={(event) => setField('color', event.target.value)} /></Field>
              <Field label="Weight"><TextInput type="number" value={form.weight} onChange={(event) => setField('weight', event.target.value)} /></Field>
              <Field label="Warranty"><TextInput value={form.warranty} onChange={(event) => setField('warranty', event.target.value)} /></Field>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Width"><TextInput type="number" value={form.dimensions.width} onChange={(event) => setDimension('width', event.target.value)} /></Field>
              <Field label="Height"><TextInput type="number" value={form.dimensions.height} onChange={(event) => setDimension('height', event.target.value)} /></Field>
              <Field label="Depth"><TextInput type="number" value={form.dimensions.depth} onChange={(event) => setDimension('depth', event.target.value)} /></Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Tags" hint="Comma separated keywords">
                <TextInput value={form.tags} onChange={(event) => setField('tags', event.target.value)} />
              </Field>
              <Field label="Badges" hint="Comma separated labels">
                <TextInput value={form.badges} onChange={(event) => setField('badges', event.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-text">
                <input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} />
                Featured Product
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-text">
                <input type="checkbox" checked={form.bestSeller} onChange={(event) => setField('bestSeller', event.target.checked)} />
                Best Seller
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-text">
                <input type="checkbox" checked={form.newArrival} onChange={(event) => setField('newArrival', event.target.checked)} />
                New Arrival
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Status">
                <SelectField value={form.productStatus} onChange={(event) => setField('productStatus', event.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </SelectField>
              </Field>
              <Field label="Thumbnail">
                <TextInput value={form.thumbnailImage} onChange={(event) => setField('thumbnailImage', event.target.value)} placeholder="URL or upload a file below" />
              </Field>
            </div>

            <Field label="Upload Images" hint="Use image files for previews. Images are uploaded as part of the product save.">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => addImages(event.target.files)}
                className="block w-full rounded-2xl border border-dashed border-black/15 bg-[#fbf8f4] px-4 py-3 text-sm text-text/70 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
              />
            </Field>

            <div className="rounded-3xl border border-black/10 bg-[#fcfaf7] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text/70">Media Preview</h3>
                <span className="text-xs text-text/50">{form.images.length} images</span>
              </div>
              {effectiveThumbnail ? (
                <div className="mt-4 overflow-hidden rounded-3xl border border-black/10 bg-white">
                  <img
                    src={effectiveThumbnail}
                    alt="Thumbnail preview"
                    className="h-64 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = '/product-placeholder.svg';
                    }}
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-dashed border-black/10 px-4 py-14 text-center text-sm text-text/50">
                  Thumbnail preview appears here.
                </div>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {form.images.map((image, index) => (
                  <div key={image.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                    <img
                      src={image.value}
                      alt={`Product ${index + 1}`}
                      className="h-36 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/product-placeholder.svg';
                      }}
                    />
                    <div className="flex items-center gap-2 border-t border-black/5 p-3">
                      <label className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-full bg-[#f7efe3] px-3 py-2 text-xs font-semibold text-primary">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => replaceImage(index, event.target.files?.[0])}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="min-w-40" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </Button>
            {editingId ? <Button variant="ghost" onClick={resetForm}>Clear Form</Button> : null}
          </div>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-text">Catalog Inventory</h2>
            <span className="rounded-full bg-[#f7efe3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {adminProducts.length} records
            </span>
          </div>
          {adminCatalogLoading ? <div className="mt-6 text-sm text-text/60">Loading products...</div> : null}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-text/50">
                <tr>
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Flags</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {adminProducts.map((product) => (
                  <tr key={product.id} className={product.isDeleted ? 'opacity-60' : ''}>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnailImage || product.image || '/product-placeholder.svg'}
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = '/product-placeholder.svg';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-text">{product.name}</div>
                          <div className="text-xs text-text/50">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-text/70">{product.categoryName || 'Unassigned'}</td>
                    <td className="py-4 pr-4 text-text/70">
                      <div className="font-semibold text-text">PKR {Number(product.price || 0).toLocaleString()}</div>
                      {product.discountPrice ? (
                        <div className="text-xs text-text/50">Sale: PKR {Number(product.discountPrice).toLocaleString()}</div>
                      ) : null}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isDeleted
                          ? 'bg-red-50 text-red-700'
                          : product.productStatus === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {product.isDeleted ? 'Deleted' : product.productStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {product.featured ? <span className="rounded-full bg-[#f7efe3] px-3 py-1 text-xs font-semibold text-primary">Featured</span> : null}
                        {product.bestSeller ? <span className="rounded-full bg-[#1f2937] px-3 py-1 text-xs font-semibold text-white">Best Seller</span> : null}
                        {product.newArrival ? <span className="rounded-full bg-[#dff1ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">New Arrival</span> : null}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" className="px-4 py-2" onClick={() => editProduct(product)}>Edit</Button>
                        <Button variant="secondary" className="px-4 py-2" onClick={() => handleStatusToggle(product)}>
                          {product.productStatus === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant={product.isDeleted ? 'primary' : 'dark'} className="px-4 py-2" onClick={() => handleDelete(product)}>
                          {product.isDeleted ? 'Restore' : 'Trash'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!adminProducts.length ? (
                  <tr>
                    <td className="py-4 text-text/60" colSpan={6}>No products found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
