import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopOnNav from './components/ScrollToTopOnNav';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Categories from './pages/Categories';
import NewArrivals from './pages/NewArrivals';
import Offers from './pages/Offers';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import StoreInfo from './pages/StoreInfo';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminCategories from './admin/AdminCategories';
import AdminOffers from './admin/AdminOffers';
import AdminGallery from './admin/AdminGallery';
import AdminEnquiries from './admin/AdminEnquiries';
import AdminReviews from './admin/AdminReviews';
import AdminStore from './admin/AdminStore';

// Main public layout
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopBtn />
    </>
  );
}

// Admin layout
function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTopOnNav />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
          success: {
            style: { background: '#D4EDDA', color: '#155724', border: '1px solid #C3E6CB' },
            iconTheme: { primary: '#28A745', secondary: 'white' },
          },
          error: {
            style: { background: '#F8D7DA', color: '#721C24', border: '1px solid #F5C6CB' },
          },
        }}
      />
      <Routes>
        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin panel (protected + admin layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="store" element={<AdminStore />} />
        </Route>

        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/store-info" element={<StoreInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Route>
      </Routes>
    </>
  );
}
