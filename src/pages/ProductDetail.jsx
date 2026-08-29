import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiHeart, FiShoppingCart, FiShare2, FiChevronLeft, FiChevronRight,
  FiPhone, FiMapPin, FiCheck, FiPackage
} from 'react-icons/fi';
import { getProduct, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { storeSettings } = useStore();
  const { user } = useAuth();

  const whatsapp = storeSettings?.whatsapp || '916300535105';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await getProduct(id);
        setProduct(p);
        if (p) {
          setSelectedSize(p.sizes?.[0] || '');
          setSelectedColor(p.colors?.[0] || '');
          try {
            const rel = await getProducts({ categoryId: p.categoryId, limitCount: 8 });
            setRelated(rel.filter((r) => r.id !== id).slice(0, 4));
          } catch(err) {
            console.warn('Could not fetch related products (missing composite index):', err);
            setRelated([]);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-hero">
        <h1>Product Not Found</h1>
        <p>This product may have been removed.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const displayPrice = product.salePrice || product.originalPrice;
  const hasDiscount = product.originalPrice && product.salePrice && product.salePrice < product.originalPrice;
  const discount = hasDiscount
    ? product.discountPercentage || Math.round((1 - product.salePrice / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    if (!product.inStock) { toast.error('Out of stock!'); return; }
    addToCart(product, selectedSize || 'Free Size', selectedColor || 'Default', quantity);
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
  };
  
  const handleWishlistClick = () => {
    if (!user) {
      toast.error('Please login to add to wishlist.');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', { icon: '❤️' });
  };

  const whatsappMsg = encodeURIComponent(
    `Hello Dakshayani Shopping Mall! 🛍️\n\nI'm interested in:\n*${product.name}*\nProduct Code: ${product.productCode || 'N/A'}\nSize: ${selectedSize || 'N/A'}\nColor: ${selectedColor || 'N/A'}\nPrice: ₹${displayPrice}\n\nPlease provide availability and more details. Thank you!`
  );

  const nextImage = () => setSelectedImage((i) => (i + 1) % product.images.length);
  const prevImage = () => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length);

  return (
    <div className="product-detail-page page-enter">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/shop">Shop</Link> <span>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <div className="pd-layout">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-image">
              {product.images?.length > 0 ? (
                <>
                  <img src={product.images[selectedImage]} alt={product.name} />
                  {product.images.length > 1 && (
                    <>
                      <button className="img-nav prev" onClick={prevImage}><FiChevronLeft size={20}/></button>
                      <button className="img-nav next" onClick={nextImage}><FiChevronRight size={20}/></button>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image-placeholder">👗</div>
              )}
              {hasDiscount && (
                <div className="pd-discount-badge">{discount}% OFF</div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-category">{product.categoryName}</div>
            <h1 className="pd-name">{product.name}</h1>

            {/* Price */}
            <div className="pd-price-block">
              <span className="pd-price">₹{displayPrice?.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <>
                  <span className="pd-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="pd-discount-label">{discount}% off</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`pd-stock ${product.inStock ? 'in' : 'out'}`}>
              {product.inStock ? (
                <><FiCheck size={14}/> In Stock {product.stockQuantity ? `(${product.stockQuantity} available)` : ''}</>
              ) : (
                <><FiPackage size={14}/> Out of Stock</>
              )}
            </div>

            {/* Code */}
            {product.productCode && (
              <div className="pd-code">Product Code: <strong>{product.productCode}</strong></div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="pd-option-group">
                <label>Size: <strong>{selectedSize}</strong></label>
                <div className="option-chips">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`option-chip ${s === selectedSize ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="pd-option-group">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="option-chips">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`option-chip color-chip ${c === selectedColor ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      <span className="color-dot" style={{ background: c.toLowerCase() }} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-option-group">
              <label>Quantity:</label>
              <div className="qty-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button
                id="pd-add-cart"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{ flex: 1 }}
              >
                <FiShoppingCart size={18} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                id="pd-wishlist"
                className={`btn btn-icon btn-lg ${inWishlist ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleWishlistClick}
                style={{ width: '52px', height: '52px', flexShrink: 0 }}
                aria-label="Wishlist"
              >
                <FiHeart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* WhatsApp & Call */}
            <div className="pd-enquiry-row">
              <a
                href={`https://wa.me/${whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                id="pd-whatsapp"
                className="btn btn-outline w-full"
                style={{ flex: 1 }}
              >
                💬 Enquire on WhatsApp
              </a>
              <a
                href="tel:+916300535105"
                id="pd-call"
                className="btn btn-outline-gold"
                style={{ flexShrink: 0 }}
              >
                <FiPhone size={16} />
              </a>
            </div>

            {/* Specs */}
            <div className="pd-specs">
              {product.fabric && <div className="spec-row"><span>Fabric</span><strong>{product.fabric}</strong></div>}
              {product.occasion && <div className="spec-row"><span>Occasion</span><strong>{Array.isArray(product.occasion) ? product.occasion.join(', ') : product.occasion}</strong></div>}
              {product.isNewArrival && <div className="spec-row"><span>Status</span><strong className="badge badge-new">New Arrival</strong></div>}
              {product.tags?.length > 0 && (
                <div className="spec-row">
                  <span>Tags</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {product.tags.map((t) => <span key={t} className="tag-chip">{t}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="pd-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title">Similar Collection</h2>
              <div className="section-divider" />
            </div>
            <div className="products-grid-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
