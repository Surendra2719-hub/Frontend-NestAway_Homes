import React from 'react';
import { PropertyCard } from '../components/common/PropertyCard';
import { Heart, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WishlistPage = ({ properties, onSelectProperty, onNavigateExplore }) => {
  const { wishlist } = useAuth();
  const savedProperties = properties.filter(p => wishlist.includes(p.id));

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header">
        <div className="header-title-flex">
          <Heart size={28} fill="#FF385C" color="#FF385C" />
          <h1>Saved Wishlist Homes</h1>
        </div>
        <p className="subtitle">Your saved properties and favorite stays ({savedProperties.length} homes saved).</p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="empty-wishlist-box">
          <Heart size={48} color="#CCCCCC" />
          <h3>Your wishlist is empty</h3>
          <p>Explore homes and click the heart icon on any property card to save it here for quick access!</p>
          <button className="btn-primary start-explore-btn" onClick={onNavigateExplore}>
            <Compass size={18} />
            <span>Explore NestAway Stays</span>
          </button>
        </div>
      ) : (
        <div className="wishlist-properties-grid">
          {savedProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}

      <style>{`
        .wishlist-page {
          padding: 3rem 0 5rem 0;
        }

        .wishlist-header {
          margin-bottom: 2.5rem;
        }

        .header-title-flex {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
        }

        .header-title-flex h1 {
          font-size: 2.2rem;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
        }

        /* 3-Columns Grid Layout: Exactly 3 Cards Per Row */
        .wishlist-properties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .empty-wishlist-box {
          background: #FAF9F6;
          border: 2px dashed var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 4rem 2rem;
          text-align: center;
          max-width: 500px;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-wishlist-box h3 {
          font-size: 1.3rem;
        }

        .empty-wishlist-box p {
          color: var(--text-muted);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .start-explore-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 900px) {
          .wishlist-properties-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .wishlist-properties-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
