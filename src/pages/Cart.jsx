import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiMessageCircle, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { addEnquiry } from '../services/enquiryService';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart, generateWhatsAppMessage } = useCart();
  const { addToWishlist } = useWishlist();
  const { storeSettings } = useStore();
  const { user } = useAuth();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const whatsapp = storeSettings?.whatsapp || '916300535105';

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const message = generateWhatsAppMessage();
      
      // Save order to our database for admin visibility
      await addEnquiry({
        type: 'order',
        userId: user.uid,
        name: user.email, // using email as default name since we don't capture full name natively
        email: user.email,
        phone: 'WhatsApp Checkout', 
        subject: 'New Order Enquiry from Cart',
        message: message,
        cartTotal: cartTotal,
      });

      // Clear the cart so they don't double-order
      clearCart();

      // Still open whatsapp native flow as desired, encoding the text here
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate order. Please try again or call us.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="cart-page page-enter">
        <div className="page-hero">
          <h1>Shopping Cart</h1>
          <p>Please login to view your cart</p>
        </div>
        <div className="container empty-cart-container">
          <div className="empty-cart">
            <FiShoppingBag size={64} className="empty-cart-icon" />
            <h2>Login Required</h2>
            <p>You need to be logged in to add items and view your cart.</p>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
              Login or Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="page-hero">
          <h1>Shopping Cart</h1>
          <p>Your selected items</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Cart</span>
          </div>
        </div>
        <div className="container empty-cart-container">
          <div className="empty-cart">
            <FiShoppingBag size={64} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Explore our beautiful collections and add your favorites!</p>
            <Link to="/shop" id="cart-continue-shopping" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="page-hero">
        <h1>Shopping Cart</h1>
        <p>{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>Cart</span>
        </div>
      </div>

      <div className="container cart-container">
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-header">
              <h2>Cart Items</h2>
              <Link to="/shop" className="continue-shopping">Continue Shopping</Link>
            </div>

            {cartItems.map((item) => (
              <div key={item.key} className="cart-item">
                <Link to={`/product/${item.product.id}`} className="cart-item-image">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} />
                  ) : (
                    <div className="cart-img-placeholder">👗</div>
                  )}
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-category">{item.product.categoryName}</div>
                  <Link to={`/product/${item.product.id}`} className="cart-item-name">
                    {item.product.name}
                  </Link>
                  <div className="cart-item-meta">
                    <span className="meta-chip">Size: {item.size}</span>
                    <span className="meta-chip">Color: {item.color}</span>
                  </div>
                  <div className="cart-item-price">
                    ₹{(item.product.salePrice || item.product.originalPrice)?.toLocaleString('en-IN')}
                    {item.product.originalPrice && item.product.salePrice && item.product.salePrice < item.product.originalPrice && (
                      <span className="cart-original">₹{item.product.originalPrice?.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                      <FiMinus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    ₹{((item.product.salePrice || item.product.originalPrice) * item.quantity)?.toLocaleString('en-IN')}
                  </div>
                  <div className="cart-item-btns">
                    <button
                      className="cart-action-btn wishlist-btn"
                      onClick={() => {
                        addToWishlist(item.product);
                        toast.success('Moved to wishlist!', { icon: '❤️' });
                      }}
                      title="Move to Wishlist"
                    >
                      ❤️
                    </button>
                    <button
                      className="cart-action-btn remove-btn"
                      onClick={() => { removeFromCart(item.key); toast.success('Removed from cart'); }}
                      title="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Items ({cartCount})</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="text-success">To be confirmed</span>
                </div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-note">
                <FiPackage size={14} />
                <p>Online checkout is not available yet. Use the WhatsApp button below to place your order and confirm availability.</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                id="cart-whatsapp-order"
                className="btn btn-primary w-full btn-lg"
                style={{ marginTop: '1.25rem', justifyContent: 'center' }}
              >
                <FiMessageCircle size={18} />
                {isCheckoutLoading ? 'Processing...' : 'Send Order on WhatsApp'}
              </button>

              <a
                href="tel:+916300535105"
                id="cart-call-order"
                className="btn btn-outline w-full"
                style={{ marginTop: '0.75rem', justifyContent: 'center' }}
              >
                📞 Call to Order
              </a>

              <div className="summary-payment-info">
                <p>💳 Accepts: Cash, UPI, Digital Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
