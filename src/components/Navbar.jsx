import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX, FiUser, FiMapPin, FiPhone, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.jpg';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/offers', label: 'Offers' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="navbar-topbar">
        <div className="container">
          <div className="topbar-inner">
            <div className="topbar-left">
              <FiMapPin size={12} />
              <span>Opp. Anurag Hotel, VRC Centre, Nellore, AP 524003</span>
            </div>
            <div className="topbar-right">
              <a href="tel:+916300535105" className="topbar-link">
                <FiPhone size={12} />
                <span>63005 35105</span>
              </a>
              <a
                href="https://wa.me/916300535105?text=Hello%20Dakshayani%20Shopping%20Mall!%20I%20would%20like%20to%20know%20more%20about%20your%20collections."
                target="_blank"
                rel="noopener noreferrer"
                className="topbar-whatsapp"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <img src={logoImg} alt="Dakshayani Dashboard" style={{ height: '50px', width: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              <div className="logo-text">
                <span className="logo-te-main text-telugu">దాక్షాయణి</span>
                <span className="logo-te-banner text-telugu">షాపింగ్ మాల్</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="navbar-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="navbar-actions">
              <button
                id="search-toggle"
                className="action-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              <Link to={user ? "/wishlist" : "/login"} id="wishlist-nav" className="action-btn" aria-label="Wishlist">
                <FiHeart size={20} />
                {user && wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
              </Link>

              <Link to={user ? "/cart" : "/login"} id="cart-nav" className="action-btn" aria-label="Cart">
                <FiShoppingCart size={20} />
                {user && cartCount > 0 && <span className="badge-count">{cartCount}</span>}
              </Link>

              {isAdmin && (
                <Link to="/admin" className="action-btn admin-btn" aria-label="Admin Dashboard" title="Store Admin">
                  <FiSettings size={20} />
                </Link>
              )}
              
              <Link to={user ? "/profile" : "/login"} className="action-btn" aria-label="Customer Profile">
                <FiUser size={20} />
              </Link>

              {/* Hamburger */}
              <button
                id="hamburger-menu"
                className={`hamburger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="search-bar-expand animate-fade-in">
              <form onSubmit={handleSearch} className="search-form">
                <FiSearch size={18} className="search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  id="navbar-search-input"
                  placeholder="Search sarees, kurtis, lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-primary btn-sm">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                  <FiX size={18} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <div className="mobile-menu-inner">
            <form onSubmit={handleSearch} className="mobile-search">
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
                end={link.to === '/'}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mobile-divider" />
            {isAdmin && (
              <Link to="/admin" className="mobile-link admin-mobile" onClick={() => setIsOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            <Link to={user ? "/profile" : "/login"} className="mobile-link" onClick={() => setIsOpen(false)}>
              {user ? "My Profile" : "Customer Login"}
            </Link>
            <div className="mobile-contact">
              <a href="tel:+916300535105">📞 63005 35105</a>
              <a href="https://wa.me/916300535105" target="_blank" rel="noopener noreferrer">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
        {isOpen && <div className="mobile-overlay" onClick={() => setIsOpen(false)} />}
      </nav>
    </>
  );
}
