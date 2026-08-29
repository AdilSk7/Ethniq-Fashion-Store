import { useState, useEffect } from 'react';
import { FiMail, FiCheck, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import { subscribeToEnquiries, updateEnquiry, deleteEnquiry } from '../services/enquiryService';
import toast from 'react-hot-toast';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const unsub = subscribeToEnquiries(setEnquiries);
    return unsub;
  }, []);

  const markRead = async (id) => {
    await updateEnquiry(id, { isRead: true });
    toast.success('Marked as read');
  };

  const markResponded = async (id) => {
    await updateEnquiry(id, { isRead: true, isResponded: true });
    toast.success('Marked as responded');
  };

  const handleAdminReply = async () => {
    if (!replyText.trim()) return toast.error('Enter a reply');
    await updateEnquiry(selected.id, { isResponded: true, isRead: true, adminReply: replyText });
    setSelected({ ...selected, adminReply: replyText, isResponded: true, isRead: true });
    toast.success('Reply saved and status updated');
    setReplyText('');
  };

  const unread = enquiries.filter((e) => !e.isRead).length;

  return (
    <div className="admin-page-container" style={{ flex: 1 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-dark)' }}>
          Customer Enquiries
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {enquiries.length} total · <span style={{ color: unread > 0 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>{unread} unread</span>
        </p>
      </div>

      <div className={`admin-enquiry-grid ${selected ? 'split' : ''}`}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {enquiries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'white', borderRadius: '16px', border: '2px dashed #DDD' }}>
              <FiMail size={32} style={{ display: 'block', margin: '0 auto 0.75rem', color: '#DDD' }} />
              No enquiries yet.
            </div>
          )}
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              id={`enquiry-${enq.id}`}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-card)',
                border: `1.5px solid ${!enq.isRead ? 'var(--primary)' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onClick={() => { setSelected(enq); if (!enq.isRead) markRead(enq.id); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{enq.name}</strong>
                  {enq.type === 'order' && <span style={{ fontSize: '0.7rem', color: 'white', background: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>🛒 Order</span>}
                  {!enq.isRead && <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} />}
                  {enq.isResponded && <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>Responded</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  {enq.createdAt?.toDate ? new Date(enq.createdAt.toDate()).toLocaleDateString('en-IN') : 'Recent'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                📞 {enq.phone} {enq.email && `| ✉️ ${enq.email}`}
              </div>
              {enq.subject && <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>{enq.subject}</div>}
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                marginBottom: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}>
                {enq.message}
              </p>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-card)', border: 'var(--border-light)', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: 'var(--border-light)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-dark)' }}>Enquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</strong><p style={{ marginTop: '0.15rem' }}>{selected.name}</p></div>
              <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone</strong><p style={{ marginTop: '0.15rem' }}><a href={`tel:${selected.phone}`} style={{ color: 'var(--primary)' }}>{selected.phone}</a></p></div>
              {selected.email && <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</strong><p style={{ marginTop: '0.15rem' }}>{selected.email}</p></div>}
              {selected.type === 'order' && selected.cartTotal && (
                 <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Value</strong><p style={{ marginTop: '0.15rem', fontWeight: 'bold' }}>₹{selected.cartTotal.toLocaleString('en-IN')}</p></div>
              )}
              {selected.subject && <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject</strong><p style={{ marginTop: '0.15rem' }}>{selected.subject}</p></div>}
              <div><strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Message</strong><p style={{ marginTop: '0.25rem', lineHeight: 1.5, color: 'var(--text-dark)', background: 'var(--cream)', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{selected.message.replace(/\n\n+/g, '\n')}</p></div>
              
              {selected.adminReply ? (
                <div><strong style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Your Reply</strong><p style={{ marginTop: '0.25rem', lineHeight: 1.5, color: 'var(--text-dark)', background: '#F3E5E8', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{selected.adminReply.replace(/\n\n+/g, '\n')}</p></div>
              ) : (
                <div style={{ marginTop: '0.5rem' }}>
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type a reply to the customer (they will see this on their profile)..." style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'inherit', fontSize: '0.9rem', marginBottom: '0.5rem', resize: 'vertical' }} />
                  <button onClick={handleAdminReply} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Save Reply</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href={`https://wa.me/91${selected.phone?.replace(/\D/g, '')}?text=Hello ${selected.name}! Thank you for contacting Dakshayani Shopping Mall.`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                <FiMessageCircle size={13} /> WhatsApp Reply
              </a>
              <a href={`tel:${selected.phone}`} className="btn btn-outline btn-sm">📞 Call</a>
              {!selected.isResponded && (
                <button className="btn btn-sm" style={{ background: '#D4EDDA', color: 'var(--success)', border: '1px solid #C3E6CB' }} onClick={() => { markResponded(selected.id); setSelected({ ...selected, isResponded: true }); }}>
                  <FiCheck size={13} /> Mark Responded
                </button>
              )}
              <button className="btn btn-sm" style={{ background: '#FDE8E8', color: 'var(--error)', border: '1px solid #FBCBCB' }} onClick={async () => { await deleteEnquiry(selected.id); toast.success('Deleted'); setSelected(null); }}>
                <FiTrash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
