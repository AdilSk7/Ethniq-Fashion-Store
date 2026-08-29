import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiMapPin, FiPhone, FiStar, FiTruck, FiHeart,
  FiAward, FiShoppingBag, FiUsers, FiZap
} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getGalleryPhotos } from '../services/galleryService';
import { useStore } from '../context/StoreContext';
import grandInteriorImg from '../assets/grand-interior.png';
import premiumSareesImg from '../assets/premium_saree_banner.png';
import premiumWeddingImg from '../assets/premium_wedding_banner.png';
import tradSareeImg from '../assets/category_traditional_saree.png';
import partyWearImg from '../assets/category_party_wear.png';

const FALLBACK_IMAGES = {
  exterior: tradSareeImg,
  interior: grandInteriorImg,
  sarees: premiumSareesImg,
  pinkSaree: premiumWeddingImg,
  designer: partyWearImg
};

import './Home.css';

const CATEGORIES = [
  { name: 'Sarees', icon: '🥻', slug: 'saree', desc: 'Silk, Cotton, Designer' },
  { name: 'Western Wear', icon: '✨', slug: 'western', desc: 'Trendy & Stylish' },
  { name: 'Lehengas', icon: '👗', slug: 'lehenga', desc: 'Bridal & Party' },
  { name: 'Kurtis', icon: '👘', slug: 'kurti', desc: 'Casual & Formal' },
  { name: 'Salwar Suits', icon: '🌸', slug: 'salwar', desc: 'Ethnic Comfort' },
  { name: 'Wedding Wear', icon: '👰', slug: 'wedding', desc: 'Wedding Collections' },
  { name: 'Party Wear', icon: '🎉', slug: 'party', desc: 'Festive & Glamorous' },
];

const WHY_US = [
  { icon: <FiShoppingBag />, title: 'Wide Variety', desc: 'Thousands of designs from casual to bridal wear for women & men.' },
  { icon: <FiAward />, title: 'Quality Fabrics', desc: 'Curated collections featuring premium silk, cotton, georgette and more.' },
  { icon: <FiHeart />, title: 'Wedding & Party', desc: 'Perfect for weddings, festivals, and special celebrations.' },
  { icon: <FiUsers />, title: 'Friendly Service', desc: 'Patient and helpful staff guide you through every collection.' },
  { icon: <FiZap />, title: 'New Designs', desc: 'Fresh arrivals added regularly to keep you ahead of fashion.' },
  { icon: <FiTruck />, title: 'Delivery Available', desc: 'Convenient delivery option for your shopping needs.' },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { storeSettings } = useStore();
  const whatsapp = storeSettings?.whatsapp || '916300535105';

  useEffect(() => {
    const load = async () => {
      try {
        const [arrivals, feat, gallery] = await Promise.all([
          getProducts({ isNewArrival: true, limitCount: 4 }),
          getProducts({ isFeatured: true, limitCount: 4 }),
          getGalleryPhotos(),
        ]);
        setNewArrivals(arrivals);
        setFeatured(feat);
        setGalleryPhotos(gallery.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="home page-enter">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <img src={FALLBACK_IMAGES.interior} alt="Dakshayani Shopping Mall Interior" className="hero-bg-img" />
          <div className="hero-overlay" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <FiStar size={12} fill="currentColor" />
              Premium Indian Fashion Store
            </div>
            <h1 className="hero-title animate-fade-in">
              DAKSHAYANI<br />
              <span className="text-gradient-gold">SHOPPING MALL</span>
            </h1>
            <p className="hero-telugu text-telugu animate-fade-in">
              దాక్షాయణి షాపింగ్ మాల్
            </p>
            <p className="hero-tagline animate-fade-in">
              Discover Elegance in Every Collection
              <br />
              <span className="text-telugu hero-tagline-te">ప్రతి కలెక్షన్‌లో అందాన్ని కనుగొనండి</span>
            </p>
            <div className="hero-actions animate-fade-in">
              <Link to="/shop" id="hero-explore" className="btn btn-gold btn-lg">
                <FiShoppingBag size={18} />
                Explore Collection
              </Link>
              <a
                href={`https://www.google.com/maps/search/Dakshayani+Shopping+Mall+Nellore`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-visit"
                className="btn btn-ghost btn-lg"
              >
                <FiMapPin size={18} />
                Visit Our Store
              </a>
            </div>
            {/* Stats */}
            <div className="hero-stats animate-fade-in">
              <div className="stat-item">
                <span className="stat-value">
                  <FiStar size={14} fill="currentColor" style={{ color: '#FFD700', verticalAlign: 'middle' }} />
                  {' '}{storeSettings?.rating || '4.2'}
                </span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">{storeSettings?.reviews || '437'}+</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">1000+</span>
                <span className="stat-label">Designs</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">10+</span>
                <span className="stat-label">Years Serving</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Browse by Type</p>
            <h2 className="section-title">Our Collections</h2>
            <div className="section-divider" />
            <p className="section-subtitle">From everyday elegance to bridal grandeur — find your perfect look</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                id={`category-${cat.slug}`}
                className="category-card"
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </div>
                <FiArrowRight className="category-arrow" size={16} />
              </Link>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/categories" className="btn btn-outline">View All Categories</Link>
          </div>
        </div>
      </section>

      {/* ===== COLLECTION BANNER ===== */}
      <section className="collection-banner-section">
        <div className="container">
          <div className="banner-grid">
            <div className="banner-card banner-large">
              <img src={FALLBACK_IMAGES.sarees} alt="Saree Collection" />
              <div className="banner-content">
                <div className="banner-tag">Exclusive</div>
                <h3>Saree Collection</h3>
                <p>Silk, Cotton, Banarasi & Designer Sarees</p>
                <Link to="/shop?category=saree" className="btn btn-gold btn-sm">
                  Shop Now <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="banner-col">
              <div className="banner-card banner-medium">
                <img src={FALLBACK_IMAGES.designer} alt="Designer Wear" />
                <div className="banner-content">
                  <div className="banner-tag">New</div>
                  <h3>Designer Wear</h3>
                  <p>Party & Festive Collections</p>
                  <Link to="/shop?category=party" className="btn btn-gold btn-sm">
                    Explore <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="banner-card banner-medium">
                <img src={FALLBACK_IMAGES.pinkSaree} alt="Bridal Collection" />
                <div className="banner-content">
                  <div className="banner-tag">Bridal</div>
                  <h3>Wedding Collection</h3>
                  <p>Make your special day unforgettable</p>
                  <Link to="/shop?category=wedding" className="btn btn-gold btn-sm">
                    View <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Fresh From Store</p>
            <h2 className="section-title">New Arrivals</h2>
            <div className="section-divider" />
            <p className="section-subtitle">The latest additions to our stunning collection</p>
          </div>
          {loading ? (
            <div className="products-skeleton-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-skeleton">
                  <div className="skeleton" style={{ height: '280px', marginBottom: '1rem', borderRadius: '12px' }} />
                  <div className="skeleton" style={{ height: '18px', marginBottom: '0.5rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                </div>
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="products-grid-4">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty-products">
              <p>👗 New arrivals coming soon! Visit our store to see the latest collection.</p>
              <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse All Products</Link>
            </div>
          )}
          <div className="text-center mt-2xl">
            <Link to="/new-arrivals" id="see-new-arrivals" className="btn btn-outline">
              See All New Arrivals <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      {featured.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Hand-Picked</p>
              <h2 className="section-title">Featured Products</h2>
              <div className="section-divider" />
            </div>
            <div className="products-grid-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== INTERIOR SHOWCASE ===== */}
      <section className="store-showcase-section">
        <div className="container">
          <div className="showcase-inner">
            <div className="showcase-image">
              <img src={FALLBACK_IMAGES.interior} alt="Dakshayani Shopping Mall Store Interior" />
              <div className="showcase-tag">
                <FiStar size={14} fill="currentColor" />
                Premium Store Experience
              </div>
            </div>
            <div className="showcase-content">
              <p className="section-eyebrow">Inside Our Store</p>
              <h2>A World of<br /><em>Fashion</em> Awaits You</h2>
              <div className="ornament-divider">
                <div className="ornament-diamond" />
              </div>
              <p>
                Step into Dakshayani Shopping Mall and immerse yourself in a world of exquisite Indian fashion.
                Our beautifully designed showroom features thousands of hand-picked collections —
                from everyday cotton sarees to grand bridal lehengas.
              </p>
              <p className="text-telugu" style={{ color: 'var(--gold)', marginTop: '0.5rem' }}>
                ప్రీమియం షాపింగ్ అనుభవం మీ కోసం వేచి ఉంది
              </p>
              <div className="showcase-stats">
                <div className="showcase-stat"><strong>1000+</strong><span>Designs</span></div>
                <div className="showcase-stat"><strong>20+</strong><span>Categories</span></div>
                <div className="showcase-stat"><strong>10+</strong><span>Years of Service</span></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <Link to="/shop" className="btn btn-primary">
                  <FiShoppingBag size={16} /> Shop Now
                </Link>
                <Link to="/gallery" className="btn btn-outline">View Gallery</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY SHOP WITH US ===== */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Our Promise</p>
            <h2 className="section-title">Why Shop With Us?</h2>
            <div className="section-divider" />
            <p className="section-subtitle">Your satisfaction is our priority — always</p>
          </div>
          <div className="why-grid">
            {WHY_US.map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="section gallery-preview-section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Our Store</p>
            <h2 className="section-title">Photo Gallery</h2>
            <div className="section-divider" />
            <p className="section-subtitle">A peek into our beautifully curated showroom</p>
          </div>
          <div className="gallery-preview-grid">
            {/* Static real photos always shown */}
            {[FALLBACK_IMAGES.exterior, FALLBACK_IMAGES.interior, FALLBACK_IMAGES.sarees, FALLBACK_IMAGES.pinkSaree, FALLBACK_IMAGES.designer].map((img, i) => (
              <div key={i} className={`gallery-item ${i === 0 ? 'gallery-large' : ''}`}>
                <img src={img} alt={`Dakshayani Shopping Mall ${i + 1}`} loading="lazy" />
                <div className="gallery-overlay">
                  <FiZap size={20} />
                </div>
              </div>
            ))}
            {/* Dynamic gallery photos */}
            {galleryPhotos.slice(0, 3).map((photo) => (
              <div key={photo.id} className="gallery-item">
                <img src={photo.url} alt={photo.title || 'Gallery'} loading="lazy" />
                <div className="gallery-overlay"><FiZap size={20} /></div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/gallery" id="view-full-gallery" className="btn btn-primary">
              View Full Gallery <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LOCATION CTA ===== */}
      <section className="location-cta-section">
        <div className="location-cta-bg">
          <img src={FALLBACK_IMAGES.exterior} alt="Dakshayani Shopping Mall" />
          <div className="location-cta-overlay" />
        </div>
        <div className="container">
          <div className="location-cta-content">
            <h2>Visit Dakshayani Shopping Mall Today</h2>
            <p className="text-telugu">దాక్షాయణి షాపింగ్ మాల్ ని నేడే సందర్శించండి</p>
            <div className="location-info">
              <div className="info-item">
                <FiMapPin size={16} />
                <span>Opp. Anurag Hotel, near Dakshayani Silks, VRC Centre, Nellore, AP 524003</span>
              </div>
              <div className="info-item">
                <FiPhone size={16} />
                <span>63005 35105 | Open 10 AM – 9 PM Daily</span>
              </div>
            </div>
            <div className="location-cta-actions">
              <a href="tel:+916300535105" id="home-call-now" className="btn btn-gold btn-lg">
                <FiPhone size={18} /> Call Now
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%20Dakshayani%20Shopping%20Mall!%20I%20want%20to%20visit%20your%20store.`}
                target="_blank"
                rel="noopener noreferrer"
                id="home-whatsapp"
                className="btn btn-ghost btn-lg"
              >
                💬 WhatsApp
              </a>
              <a
                href="https://www.google.com/maps/search/Dakshayani+Shopping+Mall+Nellore"
                target="_blank"
                rel="noopener noreferrer"
                id="home-directions"
                className="btn btn-ghost btn-lg"
              >
                <FiMapPin size={18} /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
