import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { uploadProductImages } from '../services/storageService';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import './AdminProducts.css';

const EMPTY_PRODUCT = {
  name: '', slug: '', description: '', categoryId: '', categoryName: '',
  originalPrice: '', salePrice: '', discountPercentage: '',
  sizes: [], colors: [], fabric: '', occasion: [], productCode: '',
  stockQuantity: '', inStock: true, isFeatured: false, isNewArrival: false,
  isOffer: false, tags: [],
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom'];
const OCCASIONS = ['Casual', 'Party', 'Wedding', 'Reception', 'Evening Event', 'Birthday', 'Sangeet', 'Festival', 'Traditional Celebration', 'Office', 'Daily Wear', 'Bridal', 'Brunch'];
const FABRICS = ['Silk', 'Silk Blend', 'Cotton', 'Premium Cotton', 'Cotton Silk', 'Premium Crepe', 'Premium Silk and Velvet with Zardozi & Zari Work', 'Net with Beadwork', 'Net with Embroidery', 'Georgette', 'Chiffon', 'Net', 'Velvet', 'Linen', 'Polyester', 'Banarasi silk', 'Kanchipuram silk', 'Rayon'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const unsub = subscribeToProducts((prods) => {
      setProducts(prods);
      setLoading(false);
    });
    getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error('Failed to get categories:', err);
        setCategories([]);
      });
    return unsub;
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setNewFiles([]);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      ...EMPTY_PRODUCT,
      ...product,
      occasion: Array.isArray(product.occasion) ? product.occasion : (product.occasion ? [product.occasion] : []),
      originalPrice: product.originalPrice?.toString() || '',
      salePrice: product.salePrice?.toString() || '',
      discountPercentage: product.discountPercentage?.toString() || '',
      stockQuantity: product.stockQuantity?.toString() || '',
    });
    setNewFiles([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    toast.success('Product deleted');
    setDeleteConfirm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId) {
      toast.error('Product name and category are required');
      return;
    }
    setUploading(true);
    try {
      let images = editProduct?.images || [];
      if (newFiles.length > 0) {
        const pid = editProduct?.id || `prod_${Date.now()}`;
        const newUrls = await uploadProductImages(newFiles, pid, setUploadProgress);
        images = [...images, ...newUrls];
      }

      const productData = {
        ...form,
        images,
        originalPrice: Number(form.originalPrice) || 0,
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : null,
        stockQuantity: Number(form.stockQuantity) || 0,
        slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      if (editProduct) {
        await updateProduct(editProduct.id, productData);
        toast.success('Product updated!');
      } else {
        await addProduct(productData);
        toast.success('Product added!');
      }
      setShowForm(false);
      setEditProduct(null);
    } catch (err) {
      toast.error('Error saving product: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const toggleOccasion = (occ) => {
    setForm((f) => ({
      ...f,
      occasion: f.occasion.includes(occ) ? f.occasion.filter((o) => o !== occ) : [...f.occasion, occ],
    }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const addColor = () => {
    const c = colorInput.trim();
    if (c && !form.colors.includes(c)) {
      setForm((f) => ({ ...f, colors: [...f.colors, c] }));
    }
    setColorInput('');
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products" style={{ padding: '2rem', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{products.length} products total</p>
        </div>
        <button id="add-product-btn" className="btn btn-primary" onClick={openAdd}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="product-form-modal">
          <div className="product-form-overlay" onClick={() => setShowForm(false)} />
          <div className="product-form-panel">
            <div className="form-panel-header">
              <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="close-form-btn"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              {/* Images */}
              <div className="form-section">
                <h3>Product Images</h3>
                <ImageUploader
                  onFilesSelected={setNewFiles}
                  existingImages={editProduct?.images || []}
                  onRemoveExisting={(idx) => {
                    const imgs = [...(editProduct?.images || [])];
                    imgs.splice(idx, 1);
                    setEditProduct({ ...editProduct, images: imgs });
                  }}
                />
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span>Uploading... {Math.round(uploadProgress)}%</span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input id="prod-name" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Pink Silk Saree" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select id="prod-category" className="form-input form-select" value={form.categoryId} onChange={(e) => {
                      const cat = categories.find((c) => c.id === e.target.value);
                      setForm({ ...form, categoryId: e.target.value, categoryName: cat?.name || '' });
                    }} required>
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea id="prod-desc" className="form-input form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." />
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Product Code</label>
                    <input id="prod-code" className="form-input" value={form.productCode} onChange={(e) => setForm({ ...form, productCode: e.target.value })} placeholder="e.g. DSM-001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fabric / Material</label>
                    <select id="prod-fabric" className="form-input form-select" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })}>
                      <option value="">Select Fabric</option>
                      {FABRICS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="form-section">
                <h3>Pricing</h3>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Original Price (₹) *</label>
                    <input id="prod-orig-price" className="form-input" type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} required placeholder="e.g. 2500" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sale Price (₹)</label>
                    <input id="prod-sale-price" className="form-input" type="number" min="0" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} placeholder="e.g. 1999" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount %</label>
                    <input id="prod-discount" className="form-input" type="number" min="0" max="100" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} placeholder="e.g. 20" />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className="form-section">
                <h3>Stock & Availability</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input id="prod-stock-qty" className="form-input" type="number" min="0" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} placeholder="0" />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div className="toggle-switches">
                      {[
                        { key: 'inStock', label: 'In Stock' },
                        { key: 'isFeatured', label: 'Featured' },
                        { key: 'isNewArrival', label: 'New Arrival' },
                        { key: 'isOffer', label: 'On Offer' },
                      ].map(({ key, label }) => (
                        <label key={key} className="toggle-switch">
                          <input type="checkbox" id={`prod-${key}`} checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="form-section">
                <h3>Available Sizes</h3>
                <div className="chip-selector">
                  {SIZES.map((s) => (
                    <button type="button" key={s} className={`chip ${form.sizes.includes(s) ? 'active' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div className="form-section">
                <h3>Occasions (Optional)</h3>
                <div className="chip-selector">
                  {OCCASIONS.map((o) => (
                    <button type="button" key={o} className={`chip ${form.occasion.includes(o) ? 'active' : ''}`} onClick={() => toggleOccasion(o)}>{o}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="form-section">
                <h3>Available Colors</h3>
                <div className="flex gap-sm" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {form.colors.map((c) => (
                    <span key={c} className="chip active" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {c}
                      <button type="button" onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input id="prod-color-input" className="form-input" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} placeholder="e.g. Pink, Gold, Blue" style={{ maxWidth: '300px' }} />
                  <button type="button" className="btn btn-outline btn-sm" onClick={addColor}>Add</button>
                </div>
              </div>

              {/* Tags */}
              <div className="form-section">
                <h3>Product Tags</h3>
                <div className="flex gap-sm" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {form.tags.map((t) => (
                    <span key={t} className="chip active" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {t}
                      <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input id="prod-tag-input" className="form-input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="e.g. bridal, silk, wedding" style={{ maxWidth: '300px' }} />
                  <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>Add</button>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: 'var(--border-light)' }}>
                <button id="prod-submit" type="submit" className="btn btn-primary btn-lg" disabled={uploading}>
                  {uploading ? 'Saving...' : (editProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1.5px solid #DDD', borderRadius: '20px', padding: '0.5rem 1rem' }}>
          <FiSearch size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            id="products-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading products...</div>
      ) : (
        <div className="products-table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '48px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: 'var(--cream)', flexShrink: 0 }}>
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👗</div>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.productCode || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: '0.8rem' }}>{p.categoryName}</span></td>
                  <td>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>₹{(p.salePrice || p.originalPrice)?.toLocaleString('en-IN')}</div>
                    {p.salePrice && p.originalPrice > p.salePrice && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{p.originalPrice?.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: p.inStock ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                      {p.inStock ? `✓ ${p.stockQuantity || 'In Stock'}` : '✗ Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {p.isNewArrival && <span className="badge badge-new" style={{ fontSize: '0.65rem' }}>New</span>}
                      {p.isFeatured && <span className="badge badge-instock" style={{ fontSize: '0.65rem' }}>Featured</span>}
                      {p.isOffer && <span className="badge badge-offer" style={{ fontSize: '0.65rem' }}>Offer</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        id={`edit-prod-${p.id}`}
                        className="btn btn-icon btn-outline btn-sm"
                        onClick={() => openEdit(p)}
                        title="Edit"
                      ><FiEdit2 size={14} /></button>
                      {deleteConfirm === p.id ? (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-sm" style={{ background: 'var(--error)', color: 'white', padding: '0.3rem 0.6rem' }} onClick={() => handleDelete(p.id)}>Yes</button>
                          <button className="btn btn-sm btn-outline" style={{ padding: '0.3rem 0.6rem' }} onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button
                          id={`delete-prod-${p.id}`}
                          className="btn btn-icon btn-sm"
                          style={{ background: '#FDE8E8', color: 'var(--error)', border: '1px solid #FBCBCB' }}
                          onClick={() => setDeleteConfirm(p.id)}
                          title="Delete"
                        ><FiTrash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {products.length === 0 ? 'No products yet. Click "Add Product" to get started.' : 'No products match your search.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
