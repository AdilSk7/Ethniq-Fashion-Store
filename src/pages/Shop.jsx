import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiSliders, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { subscribeToProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Best Discount' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const OCCASIONS = ['Casual', 'Party', 'Wedding', 'Reception', 'Evening Event', 'Birthday', 'Sangeet', 'Festival', 'Traditional Celebration', 'Office', 'Daily Wear', 'Bridal', 'Brunch'];
const FABRICS = ['Silk', 'Silk Blend', 'Cotton', 'Premium Cotton', 'Cotton Silk', 'Premium Crepe', 'Premium Silk and Velvet with Zardozi & Zari Work', 'Net with Beadwork', 'Net with Embroidery', 'Georgette', 'Chiffon', 'Net', 'Velvet', 'Linen', 'Polyester', 'Banarasi silk', 'Kanchipuram silk', 'Rayon'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sizes: [],
    occasions: [],
    fabrics: [],
    inStock: false,
    isNewArrival: false,
    isOffer: false,
  });
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    getCategories().then(setCategories);
    const unsub = subscribeToProducts((prods) => {
      setProducts(prods);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    let arr = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      arr = arr.filter((p) => {
        const prodOccasions = Array.isArray(p.occasion) ? p.occasion : (p.occasion ? [p.occasion] : []);
        const occasionMatch = prodOccasions.some(o => o.toLowerCase().includes(q));

        return (
          p.name?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q) ||
          occasionMatch ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    if (filters.category) {
      arr = arr.filter((p) =>
        p.categoryName?.toLowerCase().includes(filters.category.toLowerCase()) ||
        p.categoryId === filters.category
      );
    }

    if (filters.minPrice) arr = arr.filter((p) => (p.salePrice || p.originalPrice) >= Number(filters.minPrice));
    if (filters.maxPrice) arr = arr.filter((p) => (p.salePrice || p.originalPrice) <= Number(filters.maxPrice));
    if (filters.sizes.length) arr = arr.filter((p) => filters.sizes.some((s) => p.sizes?.includes(s)));
    if (filters.occasions.length) {
      arr = arr.filter((p) => {
        const prodOccasions = Array.isArray(p.occasion) ? p.occasion : (p.occasion ? [p.occasion] : []);
        return filters.occasions.some(fo => prodOccasions.includes(fo));
      });
    }
    if (filters.fabrics.length) arr = arr.filter((p) => filters.fabrics.includes(p.fabric));
    if (filters.inStock) arr = arr.filter((p) => p.inStock);
    if (filters.isNewArrival) arr = arr.filter((p) => p.isNewArrival);
    if (filters.isOffer) arr = arr.filter((p) => p.isOffer);

    switch (sort) {
      case 'price-asc': arr.sort((a, b) => (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice)); break;
      case 'price-desc': arr.sort((a, b) => (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice)); break;
      case 'discount': arr.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)); break;
      default: arr.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }

    return arr;
  }, [products, filters, sort]);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const clearFilters = () => setFilters({
    search: '', category: '', minPrice: '', maxPrice: '',
    sizes: [], occasions: [], fabrics: [], inStock: false, isNewArrival: false, isOffer: false,
  });

  const hasFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice ||
    filters.sizes.length || filters.occasions.length || filters.fabrics.length ||
    filters.inStock || filters.isNewArrival || filters.isOffer;

  const FilterPanel = () => (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasFilters && <button onClick={clearFilters} className="clear-filters">Clear All</button>}
      </div>

      {/* Category */}
      <div className="filter-group">
        <h4>Category</h4>
        <div className="filter-options">
          <button
            className={`filter-chip ${!filters.category ? 'active' : ''}`}
            onClick={() => setFilter('category', '')}
          >All</button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip ${filters.category === cat.name ? 'active' : ''}`}
              onClick={() => setFilter('category', filters.category === cat.name ? '' : cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4>Price Range (₹)</h4>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilter('minPrice', e.target.value)}
            className="form-input"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="filter-group">
        <h4>Size</h4>
        <div className="filter-options">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`filter-chip ${filters.sizes.includes(s) ? 'active' : ''}`}
              onClick={() => toggleArrayFilter('sizes', s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div className="filter-group">
        <h4>Occasion</h4>
        <div className="filter-options">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              className={`filter-chip ${filters.occasions.includes(o) ? 'active' : ''}`}
              onClick={() => toggleArrayFilter('occasions', o)}
            >{o}</button>
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div className="filter-group">
        <h4>Fabric</h4>
        <div className="filter-options">
          {FABRICS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${filters.fabrics.includes(f) ? 'active' : ''}`}
              onClick={() => toggleArrayFilter('fabrics', f)}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="filter-group">
        <label className="toggle-filter">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => setFilter('inStock', e.target.checked)} />
          <span>In Stock Only</span>
        </label>
        <label className="toggle-filter">
          <input type="checkbox" checked={filters.isNewArrival} onChange={(e) => setFilter('isNewArrival', e.target.checked)} />
          <span>New Arrivals</span>
        </label>
        <label className="toggle-filter">
          <input type="checkbox" checked={filters.isOffer} onChange={(e) => setFilter('isOffer', e.target.checked)} />
          <span>On Offer</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="shop-page page-enter">
      {/* Hero */}
      <div className="page-hero">
        <h1>Our Collections</h1>
        <p>Browse our complete range of premium Indian clothing</p>
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span>Shop</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Top Bar */}
        <div className="shop-topbar">
          <div className="shop-search">
            <FiSearch size={16} />
            <input
              type="text"
              id="shop-search"
              placeholder="Search sarees, kurtis, lehengas..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
            {filters.search && (
              <button onClick={() => setFilter('search', '')}><FiX size={14} /></button>
            )}
          </div>
          <div className="shop-controls">
            <select
              id="shop-sort"
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              id="mobile-filter-btn"
              className={`filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <FiSliders size={16} />
              Filters
              {hasFilters && <span className="filter-badge" />}
            </button>
          </div>
        </div>

        <div className="shop-result-count">
          {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        <div className="shop-layout">
          {/* Desktop Filters Sidebar */}
          <aside className={`shop-sidebar ${filtersOpen ? 'open' : ''}`}>
            <FilterPanel />
          </aside>

          {/* Products */}
          <main className="shop-main">
            {loading ? (
              <div className="shop-products-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="product-skeleton">
                    <div className="skeleton" style={{ height: '280px', marginBottom: '1rem', borderRadius: '12px' }} />
                    <div className="skeleton" style={{ height: '18px', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="shop-products-grid">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="shop-empty">
                <div className="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {filtersOpen && (
        <div className="filter-mobile-overlay" onClick={() => setFiltersOpen(false)} />
      )}
    </div>
  );
}
