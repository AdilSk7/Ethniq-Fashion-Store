import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ isNewArrival: true })
      .then((prods) => {
        setProducts(prods);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching new arrivals:', err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h1>New Arrivals</h1>
        <p>The latest additions to our stunning collection</p>
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>New Arrivals</span>
        </div>
      </div>
      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ height: '280px', marginBottom: '0.75rem', borderRadius: '12px' }} />
                <div className="skeleton" style={{ height: '16px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '12px', width: '60%' }} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--cream)', borderRadius: '20px', border: '2px dashed var(--gold)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
              New arrivals coming soon!
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Visit our store to see the latest collection or browse our full catalogue.
            </p>
            <Link to="/shop" className="btn btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {products.length} new arrival{products.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
