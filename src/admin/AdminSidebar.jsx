import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiTag, FiImage, FiSettings, FiMail,
  FiLogOut, FiChevronRight, FiStar, FiHome, FiMenu, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logoImg from '../assets/logo.jpg';
import './AdminSidebar.css';

const NAV_ITEMS = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: <FiPackage />, label: 'Products' },
  { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { to: '/admin/offers', icon: <FiStar />, label: 'Offers' },
  { to: '/admin/gallery', icon: <FiImage />, label: 'Gallery' },
  { to: '/admin/enquiries', icon: <FiMail />, label: 'Enquiries' },
  { to: '/admin/reviews', icon: <FiStar />, label: 'Reviews' },
  { to: '/admin/store', icon: <FiSettings />, label: 'Store Settings' },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
// initialize state based on screen size so drawer is closed by default on mobile
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  const handleLogout = async () => {
    navigate('/login');
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
    {collapsed && (
      <button className="mobile-admin-toggle" onClick={() => setCollapsed(false)}>
        <FiMenu size={24} />
      </button>
    )}
    {/* Optional overlay for when the drawer is open on mobile */}
    {!collapsed && (
      <div className="mobile-admin-overlay" onClick={() => setCollapsed(true)}></div>
    )}

    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <img src={logoImg} alt="Dakshayani Admin" style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div className="sidebar-logo-name" style={{ fontFamily: 'var(--font-telugu)', fontSize: '1.25rem', color: '#c40a23', fontWeight: 800 }}>దాక్షాయణి</div>
              <div className="sidebar-logo-sub" style={{ fontFamily: 'var(--font-telugu)', fontSize: '0.65rem', backgroundColor: '#ffd800', color: '#111', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '2px', alignSelf: 'flex-start', marginTop: '2px' }}>షాపింగ్ మాల్</div>
            </div>
          </div>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiMenu size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link to="/" id="admin-view-site" className="sidebar-link">
          <span className="sidebar-icon"><FiHome /></span>
          {!collapsed && <span className="sidebar-label">View Site</span>}
        </Link>
        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">Admin</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
        )}
        <button
          id="admin-logout"
          className="sidebar-link logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="sidebar-icon"><FiLogOut /></span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
