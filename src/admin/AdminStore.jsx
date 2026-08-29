import { useState, useEffect } from 'react';
import { getStoreSettings, updateStoreSettings } from '../services/storeService';
import toast from 'react-hot-toast';

const Checkbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', padding: '0.3rem 0' }}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }} />
    <span>{label}</span>
  </label>
);

const Section = ({ title, children }) => (
  <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', marginBottom: '1.25rem' }}>
    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-light)' }}>{title}</h3>
    {children}
  </div>
);

export default function AdminStore() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await updateStoreSettings(settings);
      toast.success('Store settings saved!');
    } catch {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const set = (path, value) => {
    const keys = path.split('.');
    setSettings((prev) => {
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  if (!settings) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '2rem', flex: 1, maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Store Settings</h1>
        <button id="save-store-settings" className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      <Section title="Store Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Shop Name (English)', path: 'shopName', id: 'shop-name' },
            { label: 'Shop Name (Telugu)', path: 'shopNameTelugu', id: 'shop-name-te' },
            { label: 'Type', path: 'type', id: 'shop-type' },
            { label: 'Phone', path: 'phone', id: 'shop-phone' },
            { label: 'WhatsApp Number (with country code)', path: 'whatsapp', id: 'shop-whatsapp' },
            { label: 'Email', path: 'email', id: 'shop-email' },
            { label: 'Rating', path: 'rating', id: 'shop-rating' },
            { label: 'Review Count', path: 'reviews', id: 'shop-reviews' },
          ].map(({ label, path, id }) => (
            <div key={path} className="form-group">
              <label className="form-label">{label}</label>
              <input id={id} className="form-input" value={settings[path] || ''} onChange={(e) => set(path, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea id="shop-address" className="form-input form-textarea" style={{ minHeight: '80px' }} value={settings.address || ''} onChange={(e) => set('address', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Opening Hours</label>
          <input id="shop-hours" className="form-input" value={settings.openingHours || ''} onChange={(e) => set('openingHours', e.target.value)} placeholder="Monday–Sunday: 10:00 AM – 9:00 PM" />
        </div>
        <div className="form-group">
          <label className="form-label">Google Maps URL</label>
          <input id="shop-maps" className="form-input" value={settings.googleMapsUrl || ''} onChange={(e) => set('googleMapsUrl', e.target.value)} />
        </div>
      </Section>

      <Section title="Services">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
          {[
            { label: 'Delivery Available', path: 'services.delivery' },
            { label: 'In-Store Shopping', path: 'services.inStoreShopping' },
            { label: 'In-Store Pickup', path: 'services.inStorePickup' },
            { label: 'Same-Day Delivery', path: 'services.sameDayDelivery' },
          ].map(({ label, path }) => (
            <Checkbox key={path} label={label} checked={path.split('.').reduce((o, k) => o?.[k], settings) || false} onChange={(v) => set(path, v)} />
          ))}
        </div>
      </Section>

      <Section title="Parking">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
          <Checkbox label="Two-Wheeler (Bike) Parking" checked={settings.parking?.bikeParking || false} onChange={(v) => set('parking.bikeParking', v)} />
          <Checkbox label="Car Parking" checked={settings.parking?.carParking || false} onChange={(v) => set('parking.carParking', v)} />
        </div>
      </Section>

      <Section title="Accessibility & Facilities">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
          {[
            { label: 'Wheelchair Accessible', path: 'accessibility.wheelchairAccessible' },
            { label: 'Family Friendly', path: 'accessibility.familyFriendly' },
            { label: 'LGBTQ+ Friendly', path: 'accessibility.lgbtqFriendly' },
            { label: 'Restroom Available', path: 'accessibility.restroom' },
            { label: 'Changing/Trial Room', path: 'accessibility.changingRoom' },
            { label: 'Air Conditioned', path: 'accessibility.airConditioned' },
          ].map(({ label, path }) => (
            <Checkbox key={path} label={label} checked={path.split('.').reduce((o, k) => o?.[k], settings) || false} onChange={(v) => set(path, v)} />
          ))}
        </div>
      </Section>

      <Section title="Payment Methods">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
          {[
            { label: 'Cash', path: 'payments.cash' },
            { label: 'UPI', path: 'payments.upi' },
            { label: 'Digital Payments', path: 'payments.digitalPayments' },
            { label: 'Credit Card', path: 'payments.creditCard' },
            { label: 'Debit Card', path: 'payments.debitCard' },
          ].map(({ label, path }) => (
            <Checkbox key={path} label={label} checked={path.split('.').reduce((o, k) => o?.[k], settings) || false} onChange={(v) => set(path, v)} />
          ))}
        </div>
      </Section>

      <Section title="Social Media Links">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
          {[
            { label: 'Facebook URL', path: 'social.facebook', id: 'social-fb' },
            { label: 'Instagram URL', path: 'social.instagram', id: 'social-ig' },
            { label: 'YouTube URL', path: 'social.youtube', id: 'social-yt' },
          ].map(({ label, path, id }) => (
            <div key={path} className="form-group">
              <label className="form-label">{label}</label>
              <input id={id} className="form-input" value={path.split('.').reduce((o, k) => o?.[k], settings) || ''} onChange={(e) => set(path, e.target.value)} placeholder="https://" />
            </div>
          ))}
        </div>
      </Section>

      <div style={{ textAlign: 'right' }}>
        <button id="save-store-settings-bottom" className="btn btn-primary btn-lg" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>
    </div>
  );
}
