import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { subscribeToCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { uploadCategoryImage } from '../services/storageService';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '👗' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCategories(setCategories);
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = editCat?.imageUrl || '';
      if (imageFile) {
        const id = editCat?.id || `cat_${Date.now()}`;
        imageUrl = await uploadCategoryImage(imageFile, id);
      }
      const data = { ...form, imageUrl };
      if (editCat) {
        await updateCategory(editCat.id, data);
        toast.success('Category updated!');
      } else {
        await addCategory(data);
        toast.success('Category added!');
      }
      setShowForm(false);
      setEditCat(null);
      setForm({ name: '', description: '', icon: '👗' });
      setImageFile(null);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Categories</h1>
        <button id="add-category-btn" className="btn btn-primary" onClick={() => { setEditCat(null); setForm({ name: '', description: '', icon: '👗' }); setShowForm(true); }}>
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            {editCat ? 'Edit Category' : 'New Category'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input id="cat-name" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Sarees" />
              </div>
              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <input id="cat-icon" className="form-input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🥻" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Description</label>
              <input id="cat-desc" className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Category description" />
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Category Image</label>
              <input id="cat-image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="form-input" style={{ padding: '0.5rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button id="cat-submit" type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Saving...' : (editCat ? 'Update' : 'Add Category')}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)' }}>
            <div style={{ height: '220px', background: cat.imageUrl ? `url(${cat.imageUrl}) top center/cover` : 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              {!cat.imageUrl && (cat.icon || '👗')}
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>{cat.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{cat.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button id={`edit-cat-${cat.id}`} className="btn btn-sm btn-outline" onClick={() => { setEditCat(cat); setForm({ name: cat.name, description: cat.description, icon: cat.icon || '👗' }); setShowForm(true); }}>
                  <FiEdit2 size={13} /> Edit
                </button>
                <button id={`del-cat-${cat.id}`} className="btn btn-sm" style={{ background: '#FDE8E8', color: 'var(--error)', border: '1px solid #FBCBCB' }} onClick={async () => { await deleteCategory(cat.id); toast.success('Deleted'); }}>
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'white', borderRadius: '16px', border: '2px dashed #DDD' }}>
            No categories yet. Add your first category!
          </div>
        )}
      </div>
    </div>
  );
}
