import { useState, useEffect } from 'react';
import { FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import { subscribeToReviews, addReview, deleteReview } from '../services/reviewService';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', review: '', rating: 5 });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = subscribeToReviews(setReviews);
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview(form);
    toast.success('Review added!');
    setForm({ name: '', location: '', review: '', rating: 5 });
    setShowForm(false);
  };

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Customer Reviews</h1>
        <button id="add-review-btn" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={16} /> Add Review
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Add Customer Review</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group"><label className="form-label">Customer Name *</label><input id="review-name" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Priya Reddy" /></div>
              <div className="form-group"><label className="form-label">Location</label><input id="review-location" className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Nellore" /></div>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Rating (1-5)</label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[1,2,3,4,5].map((r) => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', filter: form.rating >= r ? 'none' : 'grayscale(1) opacity(0.4)' }}>⭐</button>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}><label className="form-label">Review *</label><textarea id="review-text" className="form-input form-textarea" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required placeholder="What did the customer say?" /></div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button id="review-submit" type="submit" className="btn btn-primary">Add Review</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ display: 'flex', gap: '1rem', background: 'white', borderRadius: '14px', padding: '1.25rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-dark)' }}>{r.name}</strong>
                {r.location && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {r.location}</span>}
                <div style={{ display: 'flex', color: 'var(--gold)' }}>
                  {[...Array(r.rating || 5)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>"{r.review}"</p>
            </div>
            <button id={`del-review-${r.id}`} className="btn btn-icon btn-sm" style={{ background: '#FDE8E8', color: 'var(--error)', border: '1px solid #FBCBCB', flexShrink: 0 }} onClick={async () => { await deleteReview(r.id); toast.success('Review deleted'); }}>
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
        {reviews.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'white', borderRadius: '16px', border: '2px dashed #DDD' }}>
            No reviews added. Add your first verified customer review!
          </div>
        )}
      </div>
    </div>
  );
}
