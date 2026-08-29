import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSend, FiPhone, FiMapPin, FiMail, FiCheckCircle } from 'react-icons/fi';
import { addEnquiry } from '../services/enquiryService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in required fields (Name, Phone, Message)');
      return;
    }
    setSubmitting(true);
    try {
      const enquiryPayload = {
        ...form,
        type: 'contact',
        userId: user ? user.uid : null
      };
      await addEnquiry(enquiryPayload);
      setSubmitted(true);
      toast.success('Your enquiry has been sent! We will contact you soon.', { duration: 5000 });
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try WhatsApp or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page page-enter">
      <div className="page-hero">
        <h1>Contact Us</h1>
        <p>We're here to help — reach out to us anytime</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact</span></div>
      </div>

      <div className="container contact-container">
        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>Have questions about our collections? Want to place a special order? We're happy to help!</p>

            <div className="contact-cards">
              <a href="tel:+916300535105" className="contact-card" id="contact-call">
                <div className="contact-card-icon"><FiPhone /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>63005 35105</p>
                  <span>Mon–Sun: 10 AM – 9 PM</span>
                </div>
              </a>
              <a
                href="https://wa.me/916300535105?text=Hello%20Dakshayani%20Shopping%20Mall!%20I%20have%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card whatsapp"
                id="contact-whatsapp"
              >
                <div className="contact-card-icon" style={{ background: '#25D366' }}>
                  <span style={{ fontSize: '1.3rem' }}>💬</span>
                </div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>+91 63005 35105</p>
                  <span>Quick response guaranteed</span>
                </div>
              </a>
              <div className="contact-card">
                <div className="contact-card-icon"><FiMapPin /></div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Opp. Anurag Hotel, near Dakshayani Silks, VRC Centre</p>
                  <span>Nellore, Andhra Pradesh 524003</span>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <a
              href="https://www.google.com/maps/search/Dakshayani+Shopping+Mall+Nellore"
              target="_blank"
              rel="noopener noreferrer"
              id="contact-directions"
              className="btn btn-primary w-full"
              style={{ marginTop: '1.5rem', justifyContent: 'center' }}
            >
              <FiMapPin size={16} />
              Get Directions on Google Maps
            </a>

            {/* Map embed */}
            <div className="map-embed">
              <iframe
                title="Dakshayani Shopping Mall Location"
                src="https://www.google.com/maps?q=Dakshayani+Shopping+Mall,+VRC+Centre,+Nellore,+Andhra+Pradesh&output=embed"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap">
            <h2>Send Us a Message</h2>
            <p>Fill the form below and we'll get back to you shortly.</p>

            {submitted && (
              <div className="success-banner">
                <FiCheckCircle size={20} />
                <div>
                  <strong>Message sent successfully!</strong>
                  <p>We'll contact you on your phone number shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Phone *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="form-input"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email (optional)</label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  className="form-input"
                  placeholder="What is your enquiry about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  className="form-input form-textarea"
                  placeholder="Tell us what you're looking for or ask any questions..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button
                id="contact-submit"
                type="submit"
                className="btn btn-primary w-full btn-lg"
                disabled={submitting}
                style={{ justifyContent: 'center' }}
              >
                {submitting ? (
                  <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Sending...</>
                ) : (
                  <><FiSend size={18} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
