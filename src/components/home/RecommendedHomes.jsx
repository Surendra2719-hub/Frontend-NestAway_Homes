import React from 'react';
import { ChevronRight, Building } from 'lucide-react';
import { PropertyCard } from '../common/PropertyCard';

export const RecommendedHomes = ({ properties = [], onSelectProperty, onViewAll }) => {
  return (
    <section className="recommended-section container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Recommended for you</h2>
        </div>
        <button className="view-all-link" onClick={onViewAll}>
          <span>View all</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="empty-homes-card">
          <Building size={48} color="#FF385C" />
          <h3>No Live Properties Listed Yet</h3>
          <p>Be the first host to list a home on NestAway Homes!</p>
        </div>
      ) : (
        <div className="recommended-grid">
          {properties.slice(0, 4).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}

      <style>{`
        .recommended-section {
          margin: 3rem auto;
        }

        .empty-homes-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 3.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-sm);
        }

        .empty-homes-card h3 {
          font-size: 1.2rem;
          color: var(--text-main);
          margin-top: 0.25rem;
        }

        .empty-homes-card p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .recommended-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .recommended-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .recommended-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
