import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Check } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-top">
          {/* Brand & Tagline */}
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L4 17L7.5 19.8L20 9.6L32.5 19.8L36 17L20 4Z" fill="#FF385C" />
                <path d="M8 22C8 28.6274 13.3726 34 20 34C26.6274 34 32 28.6274 32 22H28C28 26.4183 24.4183 30 20 30C15.5817 30 12 26.4183 12 22H8Z" fill="#E2A952" />
                <path d="M20 23L18.8 21.9C14.6 18.1 11.8 15.5 11.8 12.4C11.8 9.9 13.7 8 16.2 8C17.6 8 19 8.65 20 9.7C21 8.65 22.4 8 23.8 8C26.3 8 28.2 9.9 28.2 12.4C28.2 15.5 25.4 18.1 21.2 21.91L20 23Z" fill="#FF385C" />
              </svg>
              <span className="brand-name"><strong>NestAway</strong> Homes</span>
            </div>
            <p className="footer-description">
              Comfortable homes.<br />
              Verified stays.<br />
              Hassle-free living.
            </p>
            <div className="social-icons">
              <a href="#facebook" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#instagram" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#twitter" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#linkedin" aria-label="Linkedin"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><button onClick={() => setActivePage('home')}>About Us</button></li>
              <li><button onClick={() => setActivePage('explore')}>Careers</button></li>
              <li><button onClick={() => setActivePage('home')}>Blog</button></li>
              <li><button onClick={() => setActivePage('home')}>Press</button></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><button onClick={() => setActivePage('home')}>Help Center</button></li>
              <li><button onClick={() => setActivePage('home')}>Safety Information</button></li>
              <li><button onClick={() => setActivePage('home')}>Cancellation Options</button></li>
              <li><button onClick={() => setActivePage('home')}>Contact Us</button></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><button onClick={() => setActivePage('home')}>Terms of Service</button></li>
              <li><button onClick={() => setActivePage('home')}>Privacy Policy</button></li>
              <li><button onClick={() => setActivePage('home')}>Cookie Policy</button></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="footer-newsletter">
            <h4>Subscribe to our newsletter</h4>
            <p>Get the latest updates and offers delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary subscribe-btn">
                {subscribed ? <><Check size={16} /> Subscribed!</> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 NestAway Homes. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: #FAF8F6;
          border-top: 1px solid var(--border-light);
          padding: 4rem 0 2rem 0;
          margin-top: 4rem;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 2.5fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .footer-description {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icons a {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          transition: var(--transition);
        }

        .social-icons a:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .footer-col h4, .footer-newsletter h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        .footer-col ul {
          list-style: none;
        }

        .footer-col li {
          margin-bottom: 0.75rem;
        }

        .footer-col button {
          font-size: 0.9rem;
          color: var(--text-muted);
          transition: var(--transition);
        }

        .footer-col button:hover {
          color: var(--primary);
        }

        .footer-newsletter p {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .newsletter-form input {
          width: 100%;
          background: white;
        }

        .subscribe-btn {
          width: 100%;
          padding: 0.75rem;
        }

        .footer-bottom {
          border-top: 1px solid var(--border-light);
          padding-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-top {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};
