import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const FilterSidebar = ({ filters, onApplyFilters, onClearFilters }) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice || 500);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 5000);
  const [selectedTypes, setSelectedTypes] = useState(filters.propertyTypes || []);
  const [selectedAmenities, setSelectedAmenities] = useState(filters.amenities || []);

  const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'PG / Hostel'];
  const amenitiesList = ['Wi-Fi', 'Parking', 'Air Conditioning', 'Kitchen', 'Power Backup'];

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      minPrice,
      maxPrice,
      propertyTypes: selectedTypes,
      amenities: selectedAmenities
    });
  };

  const handleClear = () => {
    setMinPrice(500);
    setMaxPrice(5000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    onClearFilters();
  };

  return (
    <aside className="filter-sidebar-card">
      <div className="filter-sidebar-header">
        <h3>Filters</h3>
        <button className="clear-all-btn" onClick={handleClear}>Clear All</button>
      </div>

      {/* Price Range Slider */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price Range</h4>
        <div className="price-display">₹{minPrice} — ₹{maxPrice}</div>
        
        <div className="range-slider-wrapper">
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-range-slider"
          />
        </div>

        <div className="price-inputs">
          <div className="price-box">
            <span>₹</span>
            <input 
              type="number" 
              value={minPrice} 
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </div>
          <span className="hyphen">-</span>
          <div className="price-box">
            <span>₹</span>
            <input 
              type="number" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <hr className="filter-divider" />

      {/* Property Type Checkboxes */}
      <div className="filter-group">
        <h4 className="filter-group-title">Property Type</h4>
        <div className="checkbox-list">
          {propertyTypes.map(type => (
            <label key={type} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
              />
              <span className="checkbox-label">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="filter-divider" />

      {/* Amenities Checkboxes */}
      <div className="filter-group">
        <h4 className="filter-group-title">Amenities</h4>
        <div className="checkbox-list">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              <span className="checkbox-label">{amenity}</span>
            </label>
          ))}
        </div>
        <button className="show-more-btn">+ Show More</button>
      </div>

      <button className="btn-primary apply-filters-btn" onClick={handleApply}>
        Apply Filters
      </button>

      <style>{`
        .filter-sidebar-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 100px;
        }

        .filter-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .filter-sidebar-header h3 {
          font-size: 1.15rem;
        }

        .clear-all-btn {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
        }

        .filter-group-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.85rem;
        }

        .price-display {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .price-range-slider {
          width: 100%;
          accent-color: var(--primary);
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-box {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.6rem;
          width: 100%;
        }

        .price-box span {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-right: 0.25rem;
        }

        .price-box input {
          border: none;
          padding: 0;
          width: 100%;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .hyphen {
          color: var(--text-muted);
        }

        .filter-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 1.25rem 0;
        }

        .checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .checkbox-item input[type="checkbox"] {
          accent-color: var(--primary);
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .show-more-btn {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
          margin-top: 0.75rem;
        }

        .apply-filters-btn {
          width: 100%;
          margin-top: 1.5rem;
          padding: 0.8rem;
        }
      `}</style>
    </aside>
  );
};
