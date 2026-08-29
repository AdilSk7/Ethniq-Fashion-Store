import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FiX, FiZoomIn } from 'react-icons/fi';
import { subscribeToGallery } from '../services/galleryService';
import './Gallery.css';
const FILTER_TAGS = ['All', 'Store Exterior', 'Inside Store', 'Saree Collection', 'Designer Wear', 'Latest Collection'];

export default function Gallery() {
  const [dynamicPhotos, setDynamicPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    const unsub = subscribeToGallery((photos) => setDynamicPhotos(photos));
    return unsub;
  }, []);

  const allPhotos = dynamicPhotos.map((p) => ({ ...p, id: p.id }));

  const filtered = activeFilter === 'All'
    ? allPhotos
    : allPhotos.filter((p) => p.category === activeFilter);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightbox(filtered[idx]);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = '';
  };

  const nextPhoto = () => {
    const next = (lightboxIdx + 1) % filtered.length;
    setLightboxIdx(next);
    setLightbox(filtered[next]);
  };

  const prevPhoto = () => {
    const prev = (lightboxIdx - 1 + filtered.length) % filtered.length;
    setLightboxIdx(prev);
    setLightbox(filtered[prev]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    if (lightbox) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, lightboxIdx, filtered]);

  return (
    <div className="gallery-page page-enter">
      <div className="page-hero">
        <h1>Photo Gallery</h1>
        <p>A visual journey through Dakshayani Shopping Mall</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Gallery</span></div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {/* Filters */}
        <div className="gallery-filters">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              id={`gallery-filter-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className={`filter-chip ${activeFilter === tag ? 'active' : ''}`}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-masonry">
          {filtered.map((photo, idx) => (
            <div
              key={photo.id}
              className="gallery-photo"
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            >
              <img src={photo.url} alt={photo.title || 'Gallery photo'} loading="lazy" />
              <div className="gallery-photo-overlay">
                <FiZoomIn size={24} />
                {photo.title && <p>{photo.title}</p>}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</p>
            <p>No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && createPortal(
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><FiX size={24} /></button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            aria-label="Previous"
          >‹</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title || ''} />
            {lightbox.title && <p className="lightbox-caption">{lightbox.title}</p>}
          </div>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            aria-label="Next"
          >›</button>
          <div className="lightbox-counter">{lightboxIdx + 1} / {filtered.length}</div>
        </div>,
        document.body
      )}
    </div>
  );
}
