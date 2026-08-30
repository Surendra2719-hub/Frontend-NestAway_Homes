import React from 'react';

export const HostCalloutBanner = ({ onBecomeHost }) => {
  return (
    <section className="host-banner-section container">
      <div className="host-banner-card">
        <div className="host-banner-content">
          <span className="host-tag">Become a Host</span>
          <h2 className="host-title">
            List your property and<br />
            earn with NestAway Homes
          </h2>
          <p className="host-desc">
            Join thousands of hosts and start earning with trusted guests.
          </p>
          <button className="btn-primary get-started-btn" onClick={onBecomeHost}>
            Get Started
          </button>
        </div>

        <div className="host-banner-image">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" 
            alt="Become a Host"
          />
        </div>
      </div>

      <style>{`
        .host-banner-section {
          margin: 4rem auto;
        }

        .host-banner-card {
          background: linear-gradient(135deg, #FFF5F2 0%, #FFF0ED 100%);
          border-radius: var(--radius-xl);
          padding: 3rem 4rem;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 2rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid #FFE4DD;
          position: relative;
          overflow: hidden;
        }

        .host-tag {
          color: var(--primary);
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .host-title {
          font-size: 2.2rem;
          line-height: 1.2;
          color: var(--text-main);
          margin-bottom: 1rem;
        }

        .host-desc {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 1.75rem;
          max-width: 450px;
        }

        .get-started-btn {
          padding: 0.85rem 2rem;
          font-size: 1rem;
        }

        .host-banner-image {
          position: relative;
          height: 260px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .host-banner-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 850px) {
          .host-banner-card {
            grid-template-columns: 1fr;
            padding: 2.5rem;
          }
          .host-banner-image {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
