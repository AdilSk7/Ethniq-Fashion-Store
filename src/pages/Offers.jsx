import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { subscribeToOffers } from '../services/offerService';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { FiX } from 'react-icons/fi';
import './Offers.css';

function Countdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const end = endDate?.toDate ? endDate.toDate() : new Date(endDate);
      const diff = end - new Date();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endDate]);

  return <span className="countdown">{timeLeft}</span>;
}

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsub = subscribeToOffers((data) => {
      setOffers(data.filter((o) => {
        if (!o.isActive) return false;
        if (!o.endDate) return true;
        const end = new Date(o.endDate);
        if (isNaN(end.getTime())) return true; // fallback if invalid
        end.setHours(23, 59, 59, 999);
        return end >= new Date();
      }));
      setLoading(false);
    });
    getProducts({ isOffer: true }).then(setOfferProducts);
    return unsub;
  }, []);

  return (
    <div className="offers-page page-enter">
      <div className="page-hero">
        <h1>Offers & Discounts</h1>
        <p>Exclusive deals and seasonal discounts just for you</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Offers</span></div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        {/* Offer Banners */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading offers...</div>
        ) : offers.length > 0 ? (
          <div className="offers-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                {offer.bannerUrl && (
                  <div className="offer-banner-img" onClick={() => setSelectedImage(offer.bannerUrl)} style={{ cursor: 'zoom-in' }}>
                    <img src={offer.bannerUrl} alt={offer.title} />
                  </div>
                )}
                <div className="offer-body" style={!offer.bannerUrl ? { borderRadius: '20px' } : {}}>
                  <div className="offer-discount-badge">{offer.discount || ''}% OFF</div>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  {offer.endDate && (
                    <div className="offer-timer">
                      ⏳ Ends in: <Countdown endDate={offer.endDate} />
                    </div>
                  )}
                  <Link to="/shop?offer=true" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>
                    Shop This Offer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="default-offers">
            <div className="offer-card">
              <div className="offer-body">
                <div className="offer-discount-badge">New</div>
                <h3>🎉 Festival Special Collections</h3>
                <p>Discover our exclusive festival and wedding collections. New designs arriving regularly at special prices!</p>
                <Link to="/shop" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>Browse Collections</Link>
              </div>
            </div>
            <div className="offer-card">
              <div className="offer-body">
                <div className="offer-discount-badge">Best</div>
                <h3>✨ Premium Quality, Affordable Prices</h3>
                <p>Dakshayani Shopping Mall brings you the best quality Indian clothing at the most affordable prices in Nellore.</p>
                <Link to="/shop" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>Shop Now</Link>
              </div>
            </div>
          </div>
        )}

        {/* Offer Products */}
        {offerProducts.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div className="section-header">
              <h2 className="section-title">Products on Offer</h2>
              <div className="section-divider" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {offerProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Visit Store CTA */}
        <div className="offer-cta">
          <h3>Visit Us for Exclusive In-Store Offers!</h3>
          <p>Many exclusive discounts and special offers are available only in-store. Visit Dakshayani Shopping Mall today!</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <a href="tel:+916300535105" className="btn btn-gold">📞 Call Now</a>
            <a href="https://wa.me/916300535105" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">💬 WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Image Modal for zooming banners */}
      {selectedImage && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }} onClick={() => setSelectedImage(null)}>
          <button style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100000 }} onClick={() => setSelectedImage(null)}>
            <FiX size={24} />
          </button>
          <img src={selectedImage} alt="Expanded Offer" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
        </div>,
        document.body
      )}
    </div>
  );
}
