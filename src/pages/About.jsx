import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiAward, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { getReviews } from '../services/reviewService';
import { useStore } from '../context/StoreContext';
import sareesImg from '../assets/sarees.png';
import exteriorImg from '../assets/shopping mall exterior.jpg';
import grandInteriorImg from '../assets/grand-interior-2.png';

const FALLBACK_IMAGES = {
  exterior: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  interior: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6199c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

const WHY_CHOOSE_US = [
  { icon: '🥻', title: 'Beautiful Collections', desc: 'Thousands of carefully curated sarees, kurtis, lehengas and more for every occasion.' },
  { icon: '✨', title: 'Variety of Designs', desc: 'From traditional to contemporary styles, we have something special for every taste.' },
  { icon: '🤝', title: 'Quality Fabrics', desc: 'Premium silk, cotton, georgette, chiffon and many more quality fabrics to choose from.' },
  { icon: '💝', title: 'Helpful Staff', desc: 'Our knowledgeable and patient staff will guide you through our entire collection.' },
  { icon: '👫', title: 'Quality Collections', desc: 'Collections for women and men — quality clothing for you.' },
  { icon: '🎊', title: 'All Occasions', desc: 'Daily wear to wedding grandeur — we have the perfect outfit for every moment.' },
];

export default function About() {
  const [reviews, setReviews] = useState([]);
  const { storeSettings } = useStore();

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h1>About Us</h1>
        <p>Our story, our collections, our promise to you</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>About</span></div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text-dark)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Dakshayani Shopping Mall<br />
              <span style={{ color: 'var(--primary)' }}>దాక్షాయణి షాపింగ్ మాల్</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Dakshayani Shopping Mall is a premier clothing store located in the heart of Nellore, Andhra Pradesh.
              We are committed to bringing the finest Indian clothing collections to the people of Nellore and
              surrounding areas — from timeless traditional wear to contemporary fusion fashion.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Our meticulously curated collection spans everything from everyday cotton sarees and comfortable kurtis
              to grand bridal lehengas and designer wedding collections. We take pride in offering quality fabrics,
              beautiful designs, and exceptional customer service.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Located opposite to Anurag Hotel near Dakshayani Silks at VRC Centre, our store is easily accessible
              with a welcoming atmosphere designed to make your shopping experience truly enjoyable.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
              <Link to="/shop" className="btn btn-primary">Browse Collections</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img src={grandInteriorImg} alt="Dakshayani Shopping Mall Interior" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '4rem',
        }}>
          {[
            { value: storeSettings?.rating || '4.2', icon: '⭐', label: 'Customer Rating' },
            { value: `${storeSettings?.reviews || '437'}+`, icon: '💬', label: 'Happy Customers' },
            { value: '1000+', icon: '👗', label: 'Designs Available' },
            { value: '10+', icon: '🏆', label: 'Years of Service' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <p className="section-eyebrow">Our Commitment</p>
            <h2 className="section-title">Why Customers Choose Us</h2>
            <div className="section-divider" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'var(--transition)',
                textAlign: 'center',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Saree Gallery Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '4rem',
          borderRadius: '24px',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', backgroundColor: '#F8F5EE' }}>
            <img src={sareesImg} alt="Saree Collection" style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem', left: '1.5rem',
              background: 'rgba(201,168,76,0.95)',
              color: 'var(--primary-dark)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}>Premium Saree Collection</div>
          </div>
          <div style={{ position: 'relative', backgroundColor: '#F8F5EE' }}>
            <img src={exteriorImg} alt="Store Exterior" style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem', left: '1.5rem',
              background: 'rgba(201,168,76,0.95)',
              color: 'var(--primary-dark)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}>Our Showroom, Nellore</div>
          </div>
        </div>

        {/* Reviews - Admin added */}
        {reviews.length > 0 && (
          <div>
            <div className="section-header">
              <p className="section-eyebrow">Customer Feedback</p>
              <h2 className="section-title">What Our Customers Say</h2>
              <div className="section-divider" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {reviews.map((r) => (
                <div key={r.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: 'var(--border-gold)',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <FiStar key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    "{r.review}"
                  </p>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-dark)' }}>{r.name}</div>
                  {r.location && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{r.location}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
