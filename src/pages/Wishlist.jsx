import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page-enter">
        <div className="page-hero">
          <h1>My Wishlist</h1>
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Wishlist</span></div>
        </div>
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <FiHeart size={64} style={{ color: 'var(--gold)', display: 'block', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem' }}>Login Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You need to be logged in to view your wishlist.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Login or Register</Link>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="page-enter">
        <div className="page-hero">
          <h1>My Wishlist</h1>
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Wishlist</span></div>
        </div>
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <FiHeart size={64} style={{ color: 'var(--gold)', display: 'block', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Save your favorite pieces and shop them later!</p>
          <Link to="/shop" className="btn btn-primary btn-lg">Browse Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h1>My Wishlist</h1>
        <p>{wishlistCount} saved item{wishlistCount !== 1 ? 's' : ''}</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Wishlist</span></div>
      </div>
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {wishlistItems.map((product) => (
            <div key={product.id} style={{
              background: 'white', borderRadius: '16px', overflow: 'hidden',
              boxShadow: 'var(--shadow-card)', border: '1px solid #F0E8E0'
            }}>
              <Link to={`/product/${product.id}`} style={{ display: 'block', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--cream)' }}>
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👗</div>
                )}
              </Link>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {product.categoryName}
                </div>
                <Link to={`/product/${product.id}`} style={{ display: 'block', fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  {product.name}
                </Link>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                  ₹{(product.salePrice || product.originalPrice)?.toLocaleString('en-IN')}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    id={`wishlist-cart-${product.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      addToCart(product, product.sizes?.[0] || 'Free Size', product.colors?.[0] || 'Default');
                      toast.success('Added to cart!', { icon: '🛍️' });
                    }}
                    disabled={!product.inStock}
                  >
                    <FiShoppingCart size={14} />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    id={`wishlist-remove-${product.id}`}
                    className="btn btn-icon btn-outline"
                    onClick={() => { removeFromWishlist(product.id); toast.success('Removed from wishlist'); }}
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
