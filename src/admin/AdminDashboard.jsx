import { useState, useEffect } from 'react';
import { FiPackage, FiTag, FiStar, FiImage, FiMail, FiUsers, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getOffers } from '../services/offerService';
import { getEnquiries } from '../services/enquiryService';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    newArrivals: 0,
    categories: 0,
    offers: 0,
    enquiries: 0,
    unreadEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [products, categories, offers, enquiries] = await Promise.all([
        getProducts(),
        getCategories(),
        getOffers(),
        getEnquiries(),
      ]);
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.inStock).length,
        newArrivals: products.filter((p) => p.isNewArrival).length,
        categories: categories.length,
        offers: offers.filter((o) => {
          if (!o.isActive) return false;
          if (!o.endDate) return true;
          const end = new Date(o.endDate);
          if (isNaN(end.getTime())) return true;
          end.setHours(23, 59, 59, 999);
          return end >= new Date();
        }).length,
        enquiries: enquiries.length,
        unreadEnquiries: enquiries.filter((e) => !e.isRead).length,
      });
      setLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <FiPackage />, color: 'var(--primary)', link: '/admin/products' },
    { label: 'In Stock', value: stats.activeProducts, icon: <FiShoppingBag />, color: 'var(--success)', link: '/admin/products' },
    { label: 'New Arrivals', value: stats.newArrivals, icon: <FiTrendingUp />, color: 'var(--gold)', link: '/admin/products' },
    { label: 'Categories', value: stats.categories, icon: <FiTag />, color: '#9B59B6', link: '/admin/categories' },
    { label: 'Active Offers', value: stats.offers, icon: <FiStar />, color: '#E67E22', link: '/admin/offers' },
    { label: 'Enquiries', value: stats.enquiries, icon: <FiMail />, color: '#2980B9', link: '/admin/enquiries' },
    { label: 'Unread Enquiries', value: stats.unreadEnquiries, icon: <FiMail />, color: '#E74C3C', link: '/admin/enquiries' },
  ];

  const quickLinks = [
    { to: '/admin/products', label: 'Add New Product', icon: '➕', desc: 'Upload product photos and details' },
    { to: '/admin/gallery', label: 'Upload Gallery Photos', icon: '📷', desc: 'Add photos to store gallery' },
    { to: '/admin/offers', label: 'Create Offer', icon: '🎁', desc: 'Set up promotions and discounts' },
    { to: '/admin/store', label: 'Update Store Info', icon: '⚙️', desc: 'Edit hours, services and contact' },
    { to: '/admin/enquiries', label: 'View Enquiries', icon: '📩', desc: `${stats.unreadEnquiries} unread messages` },
  ];

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Welcome back! Manage your Dakshayani Shopping Mall.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              id={`stat-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                display: 'block',
                background: 'white',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'var(--transition)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                background: `${card.color}15`,
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color,
                fontSize: '1.2rem',
                marginBottom: '0.75rem',
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: card.color, fontFamily: 'var(--font-serif)' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{card.label}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {quickLinks.map((ql) => (
          <Link
            key={ql.to}
            to={ql.to}
            id={`quick-${ql.label.toLowerCase().replace(/\s+/g, '-')}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.25rem',
              background: 'white',
              borderRadius: '16px',
              border: '1.5px solid transparent',
              boxShadow: 'var(--shadow-card)',
              transition: 'var(--transition)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ fontSize: '1.75rem' }}>{ql.icon}</div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{ql.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ql.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
