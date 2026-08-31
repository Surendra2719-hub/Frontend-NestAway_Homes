import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react';

export const HeroSection = ({ onSearch }) => {
  const [city, setCity] = useState('Jaipur');
  const [minPrice, setMinPrice] = useState('500');
  const [maxPrice, setMaxPrice] = useState('5000');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, minPrice: Number(minPrice), maxPrice: Number(maxPrice) });
  };

  return (
    <section className="hero-section">
      <div className="hero-background-overlay"></div>
      
      <div className="container hero-container">
        {/* Left Headline Text */}
        <div className="hero-content">
          <h1 className="hero-title">
            Find your<br />
            perfect place to<br />
            live with<br />
            <span className="text-primary-brand">NestAway Homes</span>
          </h1>
          <p className="hero-subtitle">
            Comfortable homes. Verified stays.<br />
            Hassle-free living.
          </p>

          {/* Ultra-Sleek Search Box Card */}
          <form onSubmit={handleSearchSubmit} className="search-card-box glass-card-hero">
            <div className="search-field">
              <div className="search-field-header">
                <MapPin size={16} className="field-icon" />
                <span className="field-label">Search by City</span>
              </div>
              <div className="select-wrapper">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </div>

            <div className="divider-line"></div>

            <div className="search-field">
              <div className="search-field-header">
                <span className="currency-symbol">₹</span>
                <span className="field-label">Min. Price</span>
              </div>
              <div className="select-wrapper">
                <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
                  <option value="500">₹ 500</option>
                  <option value="1000">₹ 1,000</option>
                  <option value="1500">₹ 1,500</option>
                  <option value="2000">₹ 2,000</option>
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </div>

            <div className="divider-line"></div>

            <div className="search-field">
              <div className="search-field-header">
                <span className="currency-symbol">₹</span>
                <span className="field-label">Max. Price</span>
              </div>
              <div className="select-wrapper">
                <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                  <option value="3000">₹ 3,000</option>
                  <option value="5000">₹ 5,000</option>
                  <option value="8000">₹ 8,000</option>
                  <option value="10000">₹ 10,000</option>
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </div>

            <button type="submit" className="btn-primary search-submit-btn">
              <Search size={18} />
              <span>Search Homes</span>
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80');
          background-size: cover;
          background-position: center right;
          min-height: 540px;
          display: flex;
          align-items: center;
          padding: 3.5rem 0;
        }

        .hero-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0.15) 100%);
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
        }

        .hero-content {
          max-width: 650px;
        }

        .hero-title {
          font-size: 3rem;
          line-height: 1.12;
          color: var(--text-main);
          margin-bottom: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 2.25rem;
          line-height: 1.5;
        }

        .glass-card-hero {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-radius: var(--radius-xl);
          padding: 1rem 1.35rem;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.9);
          max-width: 780px;
        }

        .search-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .search-field-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .field-icon {
          color: var(--primary);
        }

        .currency-symbol {
          font-weight: 700;
          color: var(--primary);
          font-size: 0.9rem;
        }

        .field-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .select-wrapper select {
          border: none;
          padding: 0.2rem 1.5rem 0.2rem 0;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-main);
          background: transparent;
          cursor: pointer;
          width: 100%;
          appearance: none;
        }

        .select-arrow {
          position: absolute;
          right: 0;
          pointer-events: none;
          color: var(--text-muted);
        }

        .divider-line {
          width: 1px;
          height: 38px;
          background: var(--border-medium);
        }

        .search-submit-btn {
          padding: 0.95rem 1.75rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          box-shadow: 0 8px 20px rgba(255, 56, 92, 0.3);
        }

        @media (max-width: 768px) {
          .hero-section {
            background-position: center;
            padding: 2.25rem 0;
            min-height: 460px;
          }
          .hero-background-overlay {
            background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0.75) 100%);
          }
          .hero-title {
            font-size: 2.1rem;
            margin-bottom: 0.85rem;
          }
          .hero-subtitle {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }
          .glass-card-hero {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 1.25rem;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          }
          .search-field {
            background: #FAF8F6;
            padding: 0.6rem 0.85rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-light);
          }
          .divider-line {
            display: none;
          }
          .search-submit-btn {
            width: 100%;
            padding: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
};
