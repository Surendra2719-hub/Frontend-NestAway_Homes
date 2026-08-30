import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PropertyCard = ({ property, onSelect }) => {
  const { wishlist, toggleWishlist } = useAuth();
  const isWishlisted = wishlist.includes(property.id);

  return (
    <div className="property-card" onClick={() => onSelect(property.id)}>
      {/* Cover Image & Badges */}
      <div className="card-image-wrapper">
        <img 
          src={property.coverImage || property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} 
          alt={property.title}
          className="card-image"
          loading="lazy"
        />

        {property.isSuperhost && (
          <span className="badge-superhost card-badge">SUPERHOST</span>
        )}

        <button 
          className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property.id);
          }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "#FF385C" : "none"} color={isWishlisted ? "#FF385C" : "#484848"} />
        </button>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title">{property.title}</h3>
        
        <div className="card-location">
          <MapPin size={14} />
          <span>{property.location || property.city}</span>
        </div>

        <div className="card-rating">
          <Star size={14} fill="#FF385C" color="#FF385C" />
          <span className="rating-score">{property.rating || '4.5'}</span>
          <span className="rating-count">({property.reviewCount || '80'})</span>
        </div>

        <div className="card-footer">
          <div className="card-price">
            <strong>₹{property.pricePerNight?.toLocaleString() || '2,000'}</strong>
            <span className="price-unit"> / night</span>
          </div>

          <button className="btn-details" onClick={(e) => { e.stopPropagation(); onSelect(property.id); }}>
            View Details
          </button>
        </div>
      </div>

      <style>{`
        .property-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-medium);
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #F0F0F0;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .property-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .wishlist-heart-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: var(--transition);
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .wishlist-heart-btn:hover {
          transform: scale(1.1);
          background: #FFFFFF;
        }

        .card-content {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.35rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .rating-score {
          font-weight: 600;
          color: var(--text-main);
        }

        .rating-count {
          color: var(--text-muted);
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid #F5F5F5;
        }

        .card-price strong {
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .price-unit {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .btn-details {
          border: 1px solid var(--primary);
          color: var(--primary);
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.45rem 1rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }

        .btn-details:hover {
          background-color: var(--primary-light);
        }
      `}</style>
    </div>
  );
};
