import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { subscribeToCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Sarees', icon: '🥻', description: 'Silk, Cotton, Designer, Banarasi and more' },
  { id: '2', name: 'Lehengas', icon: '👗', description: 'Bridal, Party and Festive Lehengas' },
  { id: '3', name: 'Kurtis', icon: '👔', description: 'Casual, Formal and Designer Kurtis' },
  { id: '4', name: 'Salwar Suits', icon: '🌸', description: 'Cotton, Silk and Designer Suits' },
  { id: '5', name: 'Bridal Wear', icon: '👰', description: 'Complete Bridal Collections' },
  { id: '6', name: 'Party Wear', icon: '🎉', description: 'Glamorous Party and Event Wear' },
  { id: '7', name: 'Designer Sarees', icon: '✨', description: 'Premium Designer Saree Collections' },
  { id: '9', name: 'Daily Wear', icon: '☀️', description: 'Comfortable Everyday Clothing' },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    const unsub = subscribeToCategories((cats) => {
      setCategories(cats.length > 0 ? cats : DEFAULT_CATEGORIES);
    });
    return unsub;
  }, []);

  useEffect(() => {
    getProducts().then((prods) => {
      const counts = {};
      prods.forEach((p) => {
        counts[p.categoryName] = (counts[p.categoryName] || 0) + 1;
      });
      setProductCounts(counts);
    });
  }, []);

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h1>Shop by Category</h1>
        <p>Explore our complete range of Indian clothing collections</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Categories</span></div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              id={`cat-${cat.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* Category image or icon */}
              <div style={{
                height: '240px',
                background: cat.imageUrl
                  ? `url(${cat.imageUrl}) top center/cover`
                  : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                position: 'relative',
              }}>
                {!cat.imageUrl && <span>{cat.icon || '👗'}</span>}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(201,168,76,0.9)',
                  color: 'var(--primary-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                }}>
                  {productCounts[cat.name] || 0} items
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {cat.description || `Browse our ${cat.name} collection`}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                  Shop Now <FiArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
