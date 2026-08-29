import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiYoutube, FiArrowRight } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import logoImg from '../assets/logo.jpg';
import './Footer.css';

const footerLinks = {
  Shop: [
    { to: '/shop', label: 'All Collections' },
    { to: '/new-arrivals', label: 'New Arrivals' },
    { to: '/offers', label: 'Offers & Discounts' },
    { to: '/categories', label: 'Categories' },
  ],
  'Quick Links': [
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About Us' },
    { to: '/store-info', label: 'Store Info' },
    { to: '/contact', label: 'Contact Us' },
  ],
  Collections: [
    { to: '/shop?category=sarees', label: 'Sarees' },
    { to: '/shop?category=lehengas', label: 'Lehengas' },
    { to: '/shop?category=kurtis', label: 'Kurtis' },
    { to: '/shop?category=bridal', label: 'Bridal Wear' },
    { to: '/shop?category=party', label: 'Party Wear' },
  ],
};

export default function Footer() {
  const { storeSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const date = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false };
      const istHour = parseInt(new Intl.DateTimeFormat('en-US', options).format(date), 10);
      
      // Store hours: 10:00 AM to 9:00 PM (21:00)
      if (istHour >= 10 && istHour < 21) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      {/* CTA Strip */}
      <div className="footer-cta">
        <div className="container">
          <div className="footer-cta-inner">
            <div className="footer-cta-text">
              <h3>Visit Dakshayani Shopping Mall Today</h3>
              <p className="text-telugu">దాక్షాయణి షాపింగ్ మాల్ ని సందర్శించండి</p>
            </div>
            <div className="footer-cta-actions">
              <a href="tel:+916300535105" className="btn btn-gold">
                <FiPhone size={16} />
                Call Now
              </a>
              <a
                href="https://wa.me/916300535105?text=Hello%20Dakshayani%20Shopping%20Mall!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                💬 WhatsApp
              </a>
              <a
                href={`https://www.google.com/maps/search/Dakshayani+Shopping+Mall+Nellore`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <FiMapPin size={16} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logoImg} alt="Dakshayani Shopping Mall" style={{ height: '50px', width: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="footer-logo-name" style={{ fontFamily: 'var(--font-telugu)', fontSize: '1.6rem', color: '#c40a23', fontWeight: 800 }}>దాక్షాయణి</div>
                  <div className="footer-logo-sub" style={{ fontFamily: 'var(--font-telugu)', fontSize: '0.75rem', backgroundColor: '#ffd800', color: '#111', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '2px', display: 'inline-block', marginTop: '2px' }}>షాపింగ్ మాల్</div>
                </div>
              </div>
              <p className="footer-tagline text-telugu">
                దాక్షాయణి షాపింగ్ మాల్
              </p>
              <p className="footer-desc">
                Your one-stop destination for premium Indian clothing in Nellore. 
                From everyday wear to wedding collections — discover elegance in every piece.
              </p>
              <div className="footer-contact-items">
                <a href="tel:+916300535105" className="footer-contact-item">
                  <FiPhone size={15} />
                  <span>63005 35105</span>
                </a>
                <div className="footer-contact-item">
                  <FiMapPin size={15} />
                  <span>Opp. Anurag Hotel, VRC Centre, Nellore, AP 524003</span>
                </div>
              </div>
              {/* Social */}
              <div className="footer-social">
                {storeSettings?.social?.facebook && (
                  <a href={storeSettings.social.facebook} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FiFacebook size={18} />
                  </a>
                )}
                {storeSettings?.social?.instagram && (
                  <a href={storeSettings.social.instagram} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FiInstagram size={18} />
                  </a>
                )}
                {storeSettings?.social?.youtube && (
                  <a href={storeSettings.social.youtube} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FiYoutube size={18} />
                  </a>
                )}
                <a href="https://wa.me/916300535105" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-btn">
                  <span style={{ fontSize: '1.1rem' }}>💬</span>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="footer-col">
                <h4 className="footer-col-title">{title}</h4>
                <ul className="footer-links">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer-link">
                        <FiArrowRight size={12} />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Opening Hours */}
            <div className="footer-col">
              <h4 className="footer-col-title">Store Hours</h4>
              <div className="footer-hours">
                <div className="hours-item">
                  <span>Mon – Sun</span>
                  <span className="hours-time">10:00 AM – 9:00 PM</span>
                </div>
                <div className={`hours-badge ${!isOpen ? 'closed' : ''}`}>
                  <span className={`dot ${!isOpen ? 'closed' : ''}`} />
                  {isOpen ? 'Open Now' : 'Closed'}
                </div>
              </div>
              <div className="footer-map-preview">
                <FiMapPin className="map-icon" />
                <div>
                  <p>Opp. Anurag Hotel,</p>
                  <p>near Dakshayani Silks,</p>
                  <p>VRC Centre, Nellore</p>
                  <p>Andhra Pradesh – 524003</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>© {new Date().getFullYear()} Dakshayani Shopping Mall. All rights reserved.</p>
            <p>
              Made with ❤️ for the people of{' '}
              <a href="https://en.wikipedia.org/wiki/Nellore" target="_blank" rel="noopener noreferrer">Nellore</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
