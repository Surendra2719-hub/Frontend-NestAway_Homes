import React, { useState } from 'react';
import { PropertyCard } from '../components/common/PropertyCard';
import { Filter, Search, SlidersHorizontal, Map, Grid, MapPin, Star, RotateCcw } from 'lucide-react';

export const ExplorePage = ({ properties, filters, onFilterChange, onResetFilters, onSelectProperty }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedMapProperty, setSelectedMapProperty] = useState(null);

  const handleCityChange = (e) => {
    onFilterChange({ city: e.target.value });
  };

  const handlePriceChange = (e) => {
    onFilterChange({ maxPrice: Number(e.target.value) });
  };

  const isFiltered = (filters.city && filters.city !== 'All') || (filters.maxPrice && filters.maxPrice < 10000);

  return (
    <div className="explore-page container">
      {/* Search & Filter Control Bar */}
      <div className="explore-controls-card">
        <div className="search-inputs-grid">
          <div className="filter-field">
            <label>City / Location</label>
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" />
              <select value={filters.city || 'All'} onChange={handleCityChange}>
                <option value="All">All Cities</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
              </select>
            </div>
          </div>

          <div className="filter-field">
            <div className="label-flex">
              <label>Max Price / Night</label>
              <strong>₹{(filters.maxPrice || 10000).toLocaleString()}</strong>
            </div>
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="500" 
              value={filters.maxPrice || 10000} 
              onChange={handlePriceChange}
              className="price-slider"
            />
          </div>

          {/* Reset Filters Button & View Mode Toggle */}
          <div className="actions-filter-row">
            {isFiltered && (
              <button className="reset-filters-btn" onClick={onResetFilters} title="Reset all filters">
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="view-toggle-wrapper">
              <label>View Mode</label>
              <div className="toggle-btn-group">
                <button 
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                  <span>Grid</span>
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                  onClick={() => setViewMode('map')}
                >
                  <Map size={16} />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="explore-content-area">
        <div className="explore-results-header">
          <div className="header-results-left">
            <h2>Available Stays ({properties.length} homes found)</h2>
            <span className="results-subtext">Showing verified listings in {filters.city || 'All Cities'}</span>
          </div>

          {isFiltered && (
            <button className="reset-link-btn" onClick={onResetFilters}>
              <RotateCcw size={14} />
              <span>Clear Active Filters</span>
            </button>
          )}
        </div>

        {viewMode === 'grid' ? (
          /* Grid View - Exactly 3 Cards Per Row */
          properties.length === 0 ? (
            <div className="no-results-box">
              <p>No properties match your filter criteria.</p>
              <button className="btn-primary reset-empty-btn" onClick={onResetFilters}>
                <RotateCcw size={16} />
                <span>Reset All Search Filters</span>
              </button>
            </div>
          ) : (
            <div className="explore-properties-grid">
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          )
        ) : (
          /* Interactive Map View Simulation */
          <div className="map-view-container">
            <div className="simulated-map-canvas">
              <div className="map-bg-texture">
                {/* Map Grid Roads Graphic */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E5E0DB" strokeWidth="2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="#F2EFE9" />
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                </svg>
              </div>

              {/* Map Property Pins */}
              {properties.map((prop, idx) => {
                const topPos = 20 + ((idx * 27) % 65);
                const leftPos = 15 + ((idx * 33) % 70);
                return (
                  <button
                    key={prop.id}
                    className={`map-price-pin ${selectedMapProperty?.id === prop.id ? 'active' : ''}`}
                    style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                    onClick={() => setSelectedMapProperty(prop)}
                  >
                    <span>₹{prop.pricePerNight?.toLocaleString()}</span>
                  </button>
                );
              })}

              {/* Map Selected Property Preview Card */}
              {selectedMapProperty && (
                <div className="map-preview-card">
                  <img src={selectedMapProperty.coverImage || selectedMapProperty.images?.[0]} alt={selectedMapProperty.title} />
                  <div className="map-preview-info">
                    <h4>{selectedMapProperty.title}</h4>
                    <p>{selectedMapProperty.location || selectedMapProperty.city}</p>
                    <div className="map-card-price-row">
                      <strong>₹{selectedMapProperty.pricePerNight?.toLocaleString()} / night</strong>
                      <button className="btn-primary mini-view-btn" onClick={() => onSelectProperty(selectedMapProperty.id)}>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .explore-page {
          padding: 2rem 0 5rem 0;
        }

        .explore-controls-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 1.5rem 2rem;
          box-shadow: var(--shadow-sm);
          margin-bottom: 2.5rem;
        }

        .search-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr auto;
          gap: 2rem;
          align-items: center;
        }

        .filter-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .filter-field label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .label-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label-flex strong {
          color: #FF385C;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-light);
        }

        .input-with-icon select {
          width: 100%;
          padding: 0.6rem 0.85rem 0.6rem 2.4rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .price-slider {
          accent-color: #FF385C;
          width: 100%;
        }

        .actions-filter-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 600;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-pill);
          color: var(--text-muted);
          background: #F7F7F7;
          margin-top: 1.25rem;
        }

        .reset-filters-btn:hover {
          color: #FF385C;
          border-color: #FF385C;
          background: #FFF0F3;
        }

        .view-toggle-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .view-toggle-wrapper label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .toggle-btn-group {
          display: flex;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-pill);
          overflow: hidden;
          padding: 2px;
          background: #F7F7F7;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: var(--radius-pill);
        }

        .toggle-btn.active {
          background: white;
          color: #FF385C;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .explore-results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }

        .explore-results-header h2 {
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
        }

        .results-subtext {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .reset-link-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #FF385C;
          font-weight: 600;
          font-size: 0.88rem;
        }

        .explore-properties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .no-results-box {
          background: #FAF8F6;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 3.5rem;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .reset-empty-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
        }

        /* Map View Simulation */
        .map-view-container {
          height: 540px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border-light);
          position: relative;
          box-shadow: var(--shadow-md);
        }

        .simulated-map-canvas {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .map-bg-texture {
          position: absolute;
          inset: 0;
        }

        .map-price-pin {
          position: absolute;
          background: white;
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-medium);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.2s ease;
          z-index: 10;
        }

        .map-price-pin:hover, .map-price-pin.active {
          background: #222222;
          color: white;
          border-color: #222222;
          transform: scale(1.15);
          z-index: 20;
        }

        .map-preview-card {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(0,0,0,0.2);
          z-index: 30;
          display: flex;
          gap: 0.85rem;
          padding: 0.75rem;
        }

        .map-preview-card img {
          width: 90px;
          height: 90px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .map-preview-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .map-preview-info h4 {
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .map-preview-info p {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .map-card-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .map-card-price-row strong {
          font-size: 0.9rem;
          color: #FF385C;
        }

        .mini-view-btn {
          padding: 0.3rem 0.75rem;
          font-size: 0.78rem;
        }

        @media (max-width: 900px) {
          .explore-properties-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .search-inputs-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 600px) {
          .explore-properties-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
