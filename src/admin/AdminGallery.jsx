import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { subscribeToGallery, addGalleryPhoto, deleteGalleryPhoto } from '../services/galleryService';
import { uploadGalleryPhoto } from '../services/storageService';
import toast from 'react-hot-toast';

const GALLERY_CATEGORIES = ['Store Exterior', 'Inside Store', 'Saree Collection', 'Designer Wear', 'Mannequin Display', 'Latest Collection'];

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Latest Collection');
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const unsub = subscribeToGallery(setPhotos);
    return unsub;
  }, []);

  const handleUpload = async () => {
    if (!files.length) { toast.error('Please select at least one image'); return; }
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i) / files.length) * 100));
        const url = await uploadGalleryPhoto(files[i]);
        await addGalleryPhoto({ url, title: title || files[i].name, category });
      }
      setProgress(100);
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded!`);
      setFiles([]);
      setTitle('');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Gallery</h1>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{photos.length} photos</span>
      </div>

      {/* Upload Panel */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-dark)' }}>
          Upload New Photos
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Title (Optional)</label>
            <input id="gallery-title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New Saree Collection" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select id="gallery-category" className="form-input form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div
          style={{ border: '2px dashed #DDD', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'var(--cream)', marginBottom: '1rem', transition: 'var(--transition)' }}
          onClick={() => document.getElementById('gallery-file-input').click()}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#DDD'; }}
        >
          <FiUploadCloud size={28} style={{ display: 'block', margin: '0 auto 0.5rem', color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Click to select photos (PNG, JPG, WEBP)'}
          </p>
          <input id="gallery-file-input" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => setFiles(Array.from(e.target.files))} />
        </div>
        {uploading && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ height: '6px', background: '#EEE', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div style={{ height: '100%', background: 'var(--gold-gradient)', width: `${progress}%`, transition: 'width 0.3s ease', borderRadius: '3px' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploading... {progress}%</p>
          </div>
        )}
        <button id="gallery-upload-btn" className="btn btn-primary" onClick={handleUpload} disabled={uploading || !files.length}>
          <FiPlus size={16} /> {uploading ? 'Uploading...' : 'Upload Photos'}
        </button>
      </div>

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: 'var(--cream)', boxShadow: 'var(--shadow-card)' }}>
            <img src={photo.url} alt={photo.title || 'Gallery'} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '0.6rem 0.75rem', background: 'white' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.title || 'Untitled'}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{photo.category}</p>
            </div>
            {deleteConfirm === photo.id ? (
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem' }}>
                <button className="btn btn-sm" style={{ background: 'var(--error)', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={async () => { await deleteGalleryPhoto(photo.id); toast.success('Deleted'); setDeleteConfirm(null); }}>Delete</button>
                <button className="btn btn-sm" style={{ background: 'white', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              </div>
            ) : (
              <button
                id={`del-gallery-${photo.id}`}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '30px', height: '30px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setDeleteConfirm(photo.id)}
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        ))}
        {photos.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No photos uploaded yet. Upload your first gallery photo!
          </div>
        )}
      </div>
    </div>
  );
}
