import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiSettings, FiShoppingBag, FiHeart, FiLogOut, FiStar, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { addReview } from '../services/reviewService';
import { subscribeToUserEnquiries } from '../services/enquiryService';

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [reviewForm, setReviewForm] = useState({ name: '', location: '', rating: 5, review: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [myEnquiries, setMyEnquiries] = useState([]);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      const unsub = subscribeToUserEnquiries(user.uid, setMyEnquiries);
      return unsub;
    }
  }, [user, activeTab]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addReview(reviewForm);
      toast.success('Thank you! Your review has been submitted.');
      setReviewForm({ name: '', location: '', rating: 5, review: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h1>My Account</h1>
        <p>Manage your profile and orders</p>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
        <div className="profile-dashboard-layout">
          
          {/* Sidebar */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                <FiUser size={40} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', wordBreak: 'break-all' }}>{user.email}</h3>
              <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', background: isAdmin ? 'var(--gold)' : 'var(--cream)', color: isAdmin ? 'white' : 'var(--text-dark)', borderRadius: '20px', fontWeight: 600 }}>
                {isAdmin ? 'Store Admin' : 'Customer'}
              </span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('account')} 
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'account' ? 'var(--cream)' : 'transparent', color: activeTab === 'account' ? 'var(--primary)' : 'var(--text-dark)', fontWeight: activeTab === 'account' ? 500 : 400, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}
              >
                <FiSettings /> Account Details
              </button>
              <button 
                onClick={() => setActiveTab('orders')} 
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'orders' ? 'var(--cream)' : 'transparent', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-dark)', fontWeight: activeTab === 'orders' ? 500 : 400, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}
              >
                <FiMail /> My Orders & Enquiries
              </button>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-dark)' }}>
                <FiShoppingBag /> My Cart
              </Link>
              <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-dark)' }}>
                <FiHeart /> Wishlist
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#dc3545', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: '1rem' }}>
                <FiLogOut /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {activeTab === 'account' && (
              <>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Account Details</h2>
                  
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>User ID</label>
                      <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderRadius: '8px', color: 'var(--text-dark)', fontFamily: 'monospace' }}>
                        {user.uid}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</label>
                      <div style={{ padding: '0.75rem 1rem', background: '#f8f9fa', borderRadius: '8px', color: 'var(--text-dark)' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#b45309', marginBottom: '0.5rem' }}>Admin Access</h3>
                      <p style={{ color: '#92400e', marginBottom: '1rem', fontSize: '0.95rem' }}>You have full administrative rights to manage the store catalog and settings.</p>
                      <Link to="/admin" className="btn btn-primary" style={{ display: 'inline-block' }}>Go to Admin Dashboard</Link>
                    </div>
                  )}
                </div>

                {/* Submit Review Form */}
                {!isAdmin && (
                  <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Share Your Experience</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Have you shopped with us recently? We would love to hear your feedback!</p>
                    <form onSubmit={submitReview} style={{ display: 'grid', gap: '1.25rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Your Name *</label>
                          <input required type="text" className="form-input" placeholder="e.g. Priya Reddy" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Location (Optional)</label>
                          <input type="text" className="form-input" placeholder="e.g. Nellore" value={reviewForm.location} onChange={e => setReviewForm({...reviewForm, location: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Rating</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {[1,2,3,4,5].map(star => (
                            <button key={star} type="button" onClick={() => setReviewForm({...reviewForm, rating: star})} style={{ fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', color: reviewForm.rating >= star ? '#F59E0B' : '#E5E7EB' }}>
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Review *</label>
                        <textarea required className="form-input" rows="4" placeholder="How was your shopping experience?" value={reviewForm.review} onChange={e => setReviewForm({...reviewForm, review: e.target.value})}></textarea>
                      </div>
                      <button type="submit" disabled={isSubmitting} className="btn btn-gold" style={{ justifySelf: 'start', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}

            {activeTab === 'orders' && (
              <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>My Orders & Enquiries</h2>
                
                {myEnquiries.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <FiMail size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>You haven't made any order enquiries yet.</p>
                    <Link to="/shop" className="btn btn-outline" style={{ marginTop: '1rem' }}>Start Shopping</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myEnquiries.map(enq => (
                      <div key={enq.id} style={{ border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: enq.type === 'order' ? 'var(--gold)' : 'var(--text-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                              {enq.type === 'order' ? 'Order' : 'Enquiry'}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {enq.createdAt?.toDate ? new Date(enq.createdAt.toDate()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently added'}
                            </span>
                          </div>
                          
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '20px', background: enq.isResponded ? '#D4EDDA' : '#FFF3CD', color: enq.isResponded ? '#155724' : '#856404', border: `1px solid ${enq.isResponded ? '#C3E6CB' : '#FFEEBA'}` }}>
                            {enq.isResponded ? 'Responded' : 'Pending Review'}
                          </span>
                        </div>
                        
                        {(enq.type === 'order' && enq.cartTotal) && (
                          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border-light)' }}>
                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order Total</strong>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>₹{enq.cartTotal.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Your Message</strong>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.5', maxWidth: '700px' }}>{enq.message.replace(/\n\n+/g, '\n')}</p>
                        </div>
                        
                        {enq.adminReply && (
                          <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}><FiStar size={12}/> Store Reply</strong>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', background: '#F3E5E8', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5', maxWidth: '700px' }}>{enq.adminReply.replace(/\n\n+/g, '\n')}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
