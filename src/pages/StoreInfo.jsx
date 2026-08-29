import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiPhone, FiCheck, FiX } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';

function FeatureItem({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
      {value ? (
        <FiCheck size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
      ) : (
        <FiX size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
      )}
      <span style={{ color: value ? 'var(--text-dark)' : 'var(--text-light)' }}>{label}</span>
    </div>
  );
}

export default function StoreInfo() {
  const { storeSettings } = useStore();
  const s = storeSettings;

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h1>Store Information</h1>
        <p>Everything you need to know about visiting us</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Store Info</span></div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Basic Info */}
          <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', borderRadius: '24px', padding: '2.5rem', color: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'white', marginBottom: '0.4rem' }}>
                  {s?.shopName || 'Dakshayani Shopping Mall'}
                </h2>
                <p style={{ color: 'var(--gold)', fontSize: '0.9rem', fontFamily: 'var(--font-telugu)' }}>
                  {s?.shopNameTelugu || 'దాక్షాయణి షాపింగ్ మాల్'}
                </p>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s?.type || 'Clothing Store'}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  <FiMapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{s?.address || 'Opp. Anurag Hotel, VRC Centre, Nellore, AP 524003'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  <FiPhone size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span>{s?.phone || '63005 35105'}</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  <FiClock size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span>{s?.openingHours || 'Monday–Sunday: 10:00 AM – 9:00 PM'}</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(45,122,59,0.15)', border: '1px solid rgba(45,122,59,0.3)', color: '#6FCF8A', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '20px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#6FCF8A', borderRadius: '50%' }} />
                  Open
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-light)' }}>
              Services Available
            </h3>
            <FeatureItem label="Delivery Available" value={s?.services?.delivery} />
            <FeatureItem label="In-Store Shopping" value={s?.services?.inStoreShopping} />
            <FeatureItem label="In-Store Pickup" value={s?.services?.inStorePickup} />
            <FeatureItem label="Same-Day Delivery" value={s?.services?.sameDayDelivery} />
          </div>

          {/* Parking */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-light)' }}>
              Parking
            </h3>
            <FeatureItem label="Two-Wheeler Parking" value={s?.parking?.bikeParking} />
            <FeatureItem label="Car Parking" value={s?.parking?.carParking} />
          </div>

          {/* Accessibility */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-light)' }}>
              Facilities & Accessibility
            </h3>
            <FeatureItem label="Wheelchair Accessible" value={s?.accessibility?.wheelchairAccessible} />
            <FeatureItem label="Family Friendly" value={s?.accessibility?.familyFriendly} />
            <FeatureItem label="LGBTQ+ Friendly" value={s?.accessibility?.lgbtqFriendly} />
            <FeatureItem label="Restroom Available" value={s?.accessibility?.restroom} />
            <FeatureItem label="Changing/Trial Room" value={s?.accessibility?.changingRoom} />
            <FeatureItem label="Air Conditioned" value={s?.accessibility?.airConditioned} />
          </div>

          {/* Payments */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: 'var(--border-light)' }}>
              Payment Methods
            </h3>
            <FeatureItem label="Cash" value={s?.payments?.cash} />
            <FeatureItem label="UPI Payments" value={s?.payments?.upi} />
            <FeatureItem label="Digital Payments" value={s?.payments?.digitalPayments} />
            <FeatureItem label="Credit Card" value={s?.payments?.creditCard} />
            <FeatureItem label="Debit Card" value={s?.payments?.debitCard} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <a href="tel:+916300535105" className="btn btn-primary btn-lg">📞 Call Now</a>
          <a href="https://wa.me/916300535105" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">💬 WhatsApp</a>
          <a
            href="https://www.google.com/maps/search/Dakshayani+Shopping+Mall+Nellore"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            <FiMapPin size={16} /> Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
