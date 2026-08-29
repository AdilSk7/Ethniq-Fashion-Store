import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye, FiZoomIn } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { storeSettings } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const whatsapp = storeSettings?.whatsapp || '916300535105';
  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.salePrice || product.originalPrice;
  const hasDiscount = product.originalPrice && product.salePrice && product.salePrice < product.originalPrice;
  const mainImage = product.images?.[0];
  const secondImage = product.images?.[1];
  const defaultSize = product.sizes?.[0];
  const defaultColor = product.colors?.[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }
    addToCart(product, defaultSize || 'Free Size', defaultColor || 'Default');
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist.');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
    toast.success(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
      { icon: inWishlist ? '💔' : '❤️' }
    );
  };

  const whatsappMsg = encodeURIComponent(
    `Hello Dakshayani Shopping Mall! 🛍️\n\nI'm interested in:\n*${product.name}*\nProduct Code: ${product.productCode || 'N/A'}\nPrice: ₹${displayPrice}\n\nPlease provide more details. Thank you!`
  );

  return (
    <div
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        {mainImage && !imgError ? (
          <>
            <img
              src={mainImage}
              alt={product.name}
              className={`product-img main-img ${hovered && secondImage ? 'hidden' : ''}`}
              onError={() => setImgError(true)}
              loading="lazy"
            />
            {secondImage && (
              <img
                src={secondImage}
                alt={`${product.name} alternate`}
                className={`product-img hover-img ${hovered ? 'visible' : ''}`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="product-img-placeholder">
            <span>👗</span>
          </div>
        )}

        {/* Badges */}
        <div className="product-badges">
          {product.isNewArrival && <span className="badge badge-new">New</span>}
          {hasDiscount && (
            <span className="badge badge-sale">
              {product.discountPercentage || Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
            </span>
          )}
          {product.isOffer && <span className="badge badge-offer">Offer</span>}
        </div>

        {!product.inStock && (
          <div className="soldout-overlay">
            <span>Out of Stock</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="product-quick-actions">
          <button
            id={`wishlist-${product.id}`}
            className={`quick-action-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/product/${product.id}`}
            id={`quick-view-${product.id}`}
            className="quick-action-btn"
            aria-label="Quick view"
          >
            <FiEye size={16} />
          </Link>
        </div>
      </Link>

      {/* Info */}
      <div className="product-info">
        <div className="product-category">{product.categoryName}</div>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>

        {/* Price */}
        <div className="product-price">
          <span className="price-current">₹{displayPrice?.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Sizes preview */}
        {product.sizes?.length > 0 && (
          <div className="product-sizes">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="size-chip">{s}</span>
            ))}
            {product.sizes.length > 4 && <span className="size-more">+{product.sizes.length - 4}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="product-actions">
          <button
            id={`add-cart-${product.id}`}
            className="btn btn-primary btn-sm product-cart-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <FiShoppingCart size={14} />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <a
            href={`https://wa.me/${whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            id={`whatsapp-${product.id}`}
            className="btn btn-outline-gold btn-sm whatsapp-btn"
            onClick={(e) => e.stopPropagation()}
          >
            💬
          </a>
        </div>
      </div>
    </div>
  );
}
