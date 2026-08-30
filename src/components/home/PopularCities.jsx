import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MOCK_CITIES } from '../../services/mockData';

export const PopularCities = ({ onSelectCity }) => {
  return (
    <section className="cities-section container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Popular Cities</h2>
          <p className="section-subtitle">Explore homes in top cities</p>
        </div>
        <button className="view-all-link" onClick={() => onSelectCity('All')}>
          <span>View all cities</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="cities-grid">
        {MOCK_CITIES.map((city, idx) => (
          <div key={idx} className="city-card" onClick={() => onSelectCity(city.name)}>
            <img src={city.image} alt={city.name} className="city-img" />
            <div className="city-overlay">
              <h3 className="city-name">{city.name}</h3>
              <span className="city-count">{city.count}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .cities-section {
          margin: 3rem auto;
        }

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .view-all-link:hover {
          color: var(--primary-hover);
        }

        .cities-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }

        .city-card {
          position: relative;
          height: 160px;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }

        .city-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .city-card:hover .city-img {
          transform: scale(1.08);
        }

        .city-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .city-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: white;
        }

        .city-count {
          font-size: 0.78rem;
          opacity: 0.9;
        }

        @media (max-width: 900px) {
          .cities-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .cities-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
};
