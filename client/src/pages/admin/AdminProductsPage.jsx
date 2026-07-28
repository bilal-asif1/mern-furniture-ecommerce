import { useEffect, useMemo, useState } from 'react';
import AdminPageShell from '../../components/AdminPageShell';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Field, SelectField, TextArea, TextInput } from '../../components/Field';
import Toast from '../../components/Toast';
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
    permanentlyDeleteProduct,
    restoreProduct,
    toggleProductStatus,
    adminCatalogLoading,
    catalogError,
    catalogSuccess,
    toast,
    showToast,
  } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteMode, setDeleteMode] = useState('trash');

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

  const handleRestore = async (product) => {
    try {
      setDeletingId(product.id);
      await restoreProduct(product.id).unwrap();
      showToast('Product restored successfully');
    } catch (error) {
      showToast(error.message || 'Unable to restore product', 'error');
    } finally {
      setDeletingId('');
    }
  };

  const promptTrashProduct = (product) => {
    if (deletingId || saving) return;
    setDeleteTarget(product);
    setDeleteMode('trash');
  };

  const promptPermanentDeleteProduct = (product) => {
    if (deletingId || saving) return;
    setDeleteTarget(product);
    setDeleteMode('permanent');
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget || deletingId) return;

    const productId = deleteTarget.id;
    try {
      setDeletingId(productId);
      if (deleteMode === 'permanent') {
        await permanentlyDeleteProduct(productId).unwrap();
        if (editingId === productId) {
          resetForm();
        }
        showToast('Product deleted successfully');
      } else {
        await deleteProduct(productId).unwrap();
        showToast('Product moved to trash');
      }
      setDeleteTarget(null);
    } catch (error) {
      showToast(error.message || 'Unable to delete product', 'error');
    } finally {
      setDeletingId('');
    }
  };

  const handleStatusToggle = async (product) => {
    try {
      setDeletingId(product.id);
      await toggleProductStatus(product.id).unwrap();
    } catch (_error) {
      // The catalog slice already records a user-facing error message.
    } finally {
      setDeletingId('');
    }
  };

  return (
    <AdminPageShell
      title="Products"
      description="Manage catalog items, pricing, lifecycle status, and rich product media."
      actions={<Button onClick={resetForm}>{editingId ? 'Cancel Edit' : 'New Product'}</Button>}
    >
      {catalogError ? <div className="mb-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{catalogError}</div> : null}
      {catalogSuccess ? <div className="mb-4 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{catalogSuccess}</div> : null}
      <Toast message={toast.message} type={toast.type} />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="font-display text-2xl font-semibold text-text">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
            <span className="rounded-full bg-[#f7efe3] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {effectiveThumbnail ? 'Media ready' : 'No thumbnail'}
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Product Name"><TextInput value={form.name} onChange={(event) => setField('name', event.target.value)} /></Field>
              <Field label="SKU"><TextInput value={form.sku} onChange={(event) => setField('sku', event.target.value)} /></Field>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
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
            <Field label="Short Description"><TextArea rows={2} value={form.shortDescription} onChange={(event) => setField('shortDescription', event.target.value)} /></Field>
            <Field label="Description"><TextArea rows={3} value={form.description} onChange={(event) => setField('description', event.target.value)} /></Field>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Price (PKR)"><TextInput type="number" value={form.price} onChange={(event) => setField('price', event.target.value)} /></Field>
              <Field label="Discount Price"><TextInput type="number" value={form.discountPrice} onChange={(event) => setField('discountPrice', event.target.value)} /></Field>
              <Field label="Discount %"><TextInput type="number" value={form.discountPercentage} onChange={(event) => setField('discountPercentage', event.target.value)} /></Field>
              <Field label="Stock Qty"><TextInput type="number" value={form.stock} onChange={(event) => setField('stock', event.target.value)} /></Field>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Material"><TextInput value={form.material} onChange={(event) => setField('material', event.target.value)} /></Field>
              <Field label="Color"><TextInput value={form.color} onChange={(event) => setField('color', event.target.value)} /></Field>
              <Field label="Weight"><TextInput type="number" value={form.weight} onChange={(event) => setField('weight', event.target.value)} /></Field>
              <Field label="Warranty"><TextInput value={form.warranty} onChange={(event) => setField('warranty', event.target.value)} /></Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Width"><TextInput type="number" value={form.dimensions.width} onChange={(event) => setDimension('width', event.target.value)} /></Field>
              <Field label="Height"><TextInput type="number" value={form.dimensions.height} onChange={(event) => setDimension('height', event.target.value)} /></Field>
              <Field label="Depth"><TextInput type="number" value={form.dimensions.depth} onChange={(event) => setDimension('depth', event.target.value)} /></Field>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Tags" hint="Comma separated keywords">
                <TextInput value={form.tags} onChange={(event) => setField('tags', event.target.value)} />
              </Field>
              <Field label="Badges" hint="Comma separated labels">
                <TextInput value={form.badges} onChange={(event) => setField('badges', event.target.value)} />
              </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-text">
                <input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} />
                Featured
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-text">
                <input type="checkbox" checked={form.bestSeller} onChange={(event) => setField('bestSeller', event.target.checked)} />
                Best Seller
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-text">
                <input type="checkbox" checked={form.newArrival} onChange={(event) => setField('newArrival', event.target.checked)} />
                New Arrival
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
                className="block w-full rounded-xl border border-dashed border-black/15 bg-[#fbf8f4] px-3 py-2 text-sm text-text/70 file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
              />
            </Field>

            <div className="rounded-2xl border border-black/10 bg-[#fcfaf7] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text/70">Media Preview</h3>
                <span className="text-xs text-text/50">{form.images.length} images</span>
              </div>
              {effectiveThumbnail ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white">
                  <img
                    src={effectiveThumbnail}
                    alt="Thumbnail preview"
                    className="h-48 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = '/product-placeholder.svg';
                    }}
                  />
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-dashed border-black/10 px-4 py-10 text-center text-sm text-text/50">
                  Thumbnail preview appears here.
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {form.images.map((image, index) => (
                  <div key={image.id} className="overflow-hidden rounded-xl border border-black/10 bg-white">
                    <img
                      src={image.value}
                      alt={`Product ${index + 1}`}
                      className="h-32 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/product-placeholder.svg';
                      }}
                    />
                    <div className="flex items-center gap-2 border-t border-black/5 p-2">
                      <label className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-full bg-[#f7efe3] px-2 py-1.5 text-xs font-medium text-primary">
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
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-black/5">
            <Button className="min-w-36" type="submit" disabled={saving}>
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

          <div className="mt-6 overflow-x-auto pb-2">
            <table className="min-w-[1100px] w-full table-auto text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-text/50">
                <tr>
                  <th className="w-[250px] py-2 pr-4 whitespace-nowrap">Product</th>
                  <th className="w-[120px] py-2 pr-4 whitespace-nowrap">Category</th>
                  <th className="w-[120px] py-2 pr-4 whitespace-nowrap">Price</th>
                  <th className="w-[100px] py-2 pr-4 whitespace-nowrap">Status</th>
                  <th className="w-[140px] py-2 pr-4 whitespace-nowrap">Flags</th>
                  <th className="w-[260px] py-2 pr-6 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {adminProducts.map((product) => (
                  <tr key={product.id} className={product.isDeleted ? 'opacity-60' : ''}>
                    <td className="py-3 pr-4 align-top">
                      <div className="flex min-w-0 items-center gap-2">
                        <img
                          src={product.thumbnailImage || product.image || '/product-placeholder.svg'}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = '/product-placeholder.svg';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="break-words font-semibold leading-5 text-text text-sm">{product.name}</div>
                          <div className="mt-0.5 break-words text-xs text-text/50">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 align-top whitespace-normal break-words text-text/70 text-sm">{product.categoryName || 'Unassigned'}</td>
                    <td className="py-3 pr-4 align-top text-text/70 text-sm">
                      <div className="break-words font-semibold text-text">PKR {Number(product.price || 0).toLocaleString()}</div>
                      {product.discountPrice ? (
                        <div className="text-xs text-text/50">Sale: PKR {Number(product.discountPrice).toLocaleString()}</div>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.isDeleted
                          ? 'bg-red-50 text-red-700'
                          : product.productStatus === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {product.isDeleted ? 'Deleted' : product.productStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {product.featured ? <span className="rounded-full bg-[#f7efe3] px-2 py-0.5 text-xs font-medium text-primary">Featured</span> : null}
                        {product.bestSeller ? <span className="rounded-full bg-[#1f2937] px-2 py-0.5 text-xs font-medium text-white">Best Seller</span> : null}
                        {product.newArrival ? <span className="rounded-full bg-[#dff1ff] px-2 py-0.5 text-xs font-medium text-[#1d4ed8]">New Arrival</span> : null}
                      </div>
                    </td>
                    <td className="py-3 pr-6 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" className="px-3 py-1.5 text-xs font-medium whitespace-nowrap" onClick={() => editProduct(product)}>Edit</Button>
                        <Button variant="secondary" className="px-3 py-1.5 text-xs font-medium whitespace-nowrap" onClick={() => handleStatusToggle(product)} disabled={deletingId === product.id}>
                          {product.productStatus === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        {product.isDeleted ? (
                          <Button variant="primary" className="px-3 py-1.5 text-xs font-medium whitespace-nowrap" onClick={() => handleRestore(product)} disabled={deletingId === product.id}>
                            {deletingId === product.id ? 'Restoring...' : 'Restore'}
                          </Button>
                        ) : (
                          <Button variant="dark" className="px-3 py-1.5 text-xs font-medium whitespace-nowrap" onClick={() => promptTrashProduct(product)} disabled={deletingId === product.id}>
                            {deletingId === product.id ? 'Deleting...' : 'Trash'}
                          </Button>
                        )}
                        <Button variant="danger" className="px-3 py-1.5 text-xs font-medium whitespace-nowrap" onClick={() => promptPermanentDeleteProduct(product)} disabled={deletingId === product.id}>
                          {deletingId === product.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!adminProducts.length ? (
                  <tr>
                    <td className="py-3 text-text/60 text-sm" colSpan={6}>No products found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          if (!deletingId) {
            setDeleteTarget(null);
            setDeleteMode('trash');
          }
        }}
        onConfirm={confirmDeleteProduct}
        title={deleteMode === 'permanent' ? 'Delete Product' : 'Move to Trash'}
        message={
          deleteMode === 'permanent'
            ? 'Are you sure you want to permanently delete this product? This action cannot be undone.'
            : 'Are you sure you want to move this product to trash? You can restore it later.'
        }
        confirmButtonText={deleteMode === 'permanent' ? 'Delete Product' : 'Trash Product'}
        isLoading={Boolean(deleteTarget && deletingId === deleteTarget.id)}
      />
    </AdminPageShell>
  );
}
