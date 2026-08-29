import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { subscribeToOffers, addOffer, updateOffer, deleteOffer } from '../services/offerService';
import { uploadOfferBanner } from '../services/storageService';
import toast from 'react-hot-toast';

const EMPTY_OFFER = { title: '', description: '', discount: '', startDate: '', endDate: '', isActive: true };

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [form, setForm] = useState(EMPTY_OFFER);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = subscribeToOffers(setOffers);
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let bannerUrl = editOffer?.bannerUrl || '';
      if (bannerFile) {
        const id = editOffer?.id || `offer_${Date.now()}`;
        bannerUrl = await uploadOfferBanner(bannerFile, id);
      }
      const data = { ...form, bannerUrl, discount: Number(form.discount) || 0 };
      if (editOffer) {
        await updateOffer(editOffer.id, data);
        toast.success('Offer updated!');
      } else {
        await addOffer(data);
        toast.success('Offer created!');
      }
      setShowForm(false);
      setEditOffer(null);
      setForm(EMPTY_OFFER);
      setBannerFile(null);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Offers & Promotions</h1>
        <button id="add-offer-btn" className="btn btn-primary" onClick={() => { setEditOffer(null); setForm(EMPTY_OFFER); setShowForm(true); }}>
          <FiPlus size={16} /> Create Offer
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            {editOffer ? 'Edit Offer' : 'New Offer'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group"><label className="form-label">Title *</label><input id="offer-title" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Festival Sale" /></div>
              <div className="form-group"><label className="form-label">Discount %</label><input id="offer-discount" className="form-input" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="e.g. 30" /></div>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}><label className="form-label">Description</label><textarea id="offer-desc" className="form-input form-textarea" style={{ minHeight: '80px' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group"><label className="form-label">Start Date</label><input id="offer-start" className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">End Date</label><input id="offer-end" className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group"><label className="form-label">Banner Image</label><input id="offer-banner" type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} className="form-input" style={{ padding: '0.5rem' }} /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input id="offer-active" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                  <span>Active (visible to customers)</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button id="offer-submit" type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Saving...' : (editOffer ? 'Update' : 'Create Offer')}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {offers.map((offer) => (
          <div key={offer.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', flexWrap: 'wrap' }}>
            {offer.bannerUrl && <img src={offer.bannerUrl} alt={offer.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{offer.title}</span>
                {offer.discount > 0 && <span className="badge badge-sale">{offer.discount}% OFF</span>}
                {(() => {
                  let isExpired = false;
                  if (offer.endDate) {
                    const end = new Date(offer.endDate);
                    if (!isNaN(end.getTime())) {
                      end.setHours(23, 59, 59, 999);
                      isExpired = end < new Date();
                    }
                  }
                  const label = !offer.isActive ? 'Inactive' : (isExpired ? 'Expired' : 'Active');
                  const badgeClass = !offer.isActive ? 'badge-outofstock' : (isExpired ? 'badge-outofstock' : 'badge-instock');
                  return <span className={`badge ${badgeClass}`}>{label}</span>;
                })()}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{offer.description}</p>
              {(offer.startDate || offer.endDate) && <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>{offer.startDate} → {offer.endDate}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button id={`edit-offer-${offer.id}`} className="btn btn-sm btn-outline" onClick={() => { setEditOffer(offer); setForm({ title: offer.title, description: offer.description || '', discount: offer.discount || '', startDate: offer.startDate || '', endDate: offer.endDate || '', isActive: offer.isActive }); setShowForm(true); }}>
                <FiEdit2 size={13} />
              </button>
              <button id={`del-offer-${offer.id}`} className="btn btn-sm" style={{ background: '#FDE8E8', color: 'var(--error)', border: '1px solid #FBCBCB' }} onClick={async () => { await deleteOffer(offer.id); toast.success('Offer deleted'); }}>
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'white', borderRadius: '16px', border: '2px dashed #DDD' }}>
            No offers created yet. Click "Create Offer" to add your first promotion!
          </div>
        )}
      </div>
    </div>
  );
}
