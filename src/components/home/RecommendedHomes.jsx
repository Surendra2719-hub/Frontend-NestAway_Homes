import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PropertyCard } from '../common/PropertyCard';

export const RecommendedHomes = ({ properties, onSelectProperty, onViewAll }) => {
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

      <div className="recommended-grid">
        {properties.slice(0, 4).map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onSelect={onSelectProperty}
          />
        ))}
      </div>

      <style>{`
        .recommended-section {
          margin: 3rem auto;
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
