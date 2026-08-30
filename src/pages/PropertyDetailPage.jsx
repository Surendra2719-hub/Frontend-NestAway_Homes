import React, { useState, useEffect } from 'react';
import { PhotoGallery } from '../components/details/PhotoGallery';
import { BookingWidget } from '../components/details/BookingWidget';
import { 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Utensils, 
  Wifi, 
  Users, 
  Tv, 
  Zap, 
  Car, 
  Wind, 
  MessageSquare,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const PropertyDetailPage = ({ propertyId, onBack, onNavigateBookings, onNavigateAuth }) => {
  const { user, openAuthModal } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews State
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80", rating: 5, date: "August 2026", comment: "Amazing stay! Clean rooms, beautiful interior, and super helpful host Surendra. Highly recommended for family stays." },
    { id: 2, name: "Priya Verma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", rating: 5, date: "July 2026", comment: "Great location near top tourist attractions in Jaipur. Peaceful surroundings and fast Wi-Fi!" },
    { id: 3, name: "Amit Patel", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80", rating: 4, date: "June 2026", comment: "Very comfortable apartment with good parking and power backup. Host was quick to respond." }
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const data = await api.getPropertyById(propertyId);
      setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [propertyId]);

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    const reviewObj = {
      id: Date.now(),
      name: user.name || "Guest",
      avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      rating: Number(newRating),
      date: "Just now",
      comment: newComment
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setReviewSuccessMsg("Thank you! Your review has been published.");
    setNewComment('');
    setTimeout(() => {
      setReviewSuccessMsg('');
      setShowReviewModal(false);
    }, 1500);
  };

  if (loading || !property) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p>Loading property details...</p>
      </div>
    );
  }

  const getAmenityIcon = (name) => {
    switch (name) {
      case 'Wi-Fi': return <Wifi size={18} />;
      case 'Air Conditioning': return <Wind size={18} />;
      case 'Kitchen': return <Utensils size={18} />;
      case 'TV': return <Tv size={18} />;
      case 'Power Backup': return <Zap size={18} />;
      case 'Parking': return <Car size={18} />;
      default: return <Wifi size={18} />;
    }
  };

  return (
    <div className="detail-page container">
      {/* Header Info */}
      <div className="detail-header">
        {property.isSuperhost && (
          <span className="badge-superhost detail-superhost">SUPERHOST</span>
        )}
        <h1 className="detail-title">{property.title} in {property.location?.split(',')[0] || property.city}</h1>
        
        <div className="detail-meta">
          <div className="meta-item">
            <Star size={16} fill="#FF385C" color="#FF385C" />
            <strong>{property.rating || '4.8'}</strong>
            <span className="text-muted">({reviewsList.length} reviews)</span>
          </div>

          <span className="meta-dot">•</span>

          <div className="meta-item">
            <MapPin size={16} className="text-muted" />
            <span>{property.location || property.city}</span>
          </div>
        </div>
      </div>

      {/* 5-Photo Gallery Grid matching Screen 4 */}
      <PhotoGallery images={property.images} title={property.title} />

      {/* Quick Spec Pills */}
      <div className="specs-bar">
        <div className="spec-pill"><Bed size={18} /> <span>{property.bedrooms || 2} Bedrooms</span></div>
        <div className="spec-pill"><Bath size={18} /> <span>{property.bathrooms || 2} Bathrooms</span></div>
        <div className="spec-pill"><Utensils size={18} /> <span>Kitchen</span></div>
        <div className="spec-pill"><Wifi size={18} /> <span>Wi-Fi</span></div>
        <div className="spec-pill"><Users size={18} /> <span>{property.guests || 4} Guests</span></div>
      </div>

      {/* 2-Column Detail Layout */}
      <div className="detail-content-layout">
        <div className="detail-left-col">
          <section className="detail-section">
            <h2>About this place</h2>
            <p className="description-text">
              {property.description || "A beautiful and cozy apartment in the heart of Vaishali Nagar. Perfect for families, couples, and business travelers. Offers modern amenities, peaceful surroundings, and close connectivity to top attractions."}
            </p>
          </section>

          <hr className="detail-divider" />

          <section className="detail-section">
            <h2>What this place offers</h2>
            <div className="amenities-grid">
              {(property.amenities || ["Wi-Fi", "Air Conditioning", "Kitchen", "TV", "Power Backup", "Parking"]).map((amenity, idx) => (
                <div key={idx} className="amenity-item">
                  <div className="amenity-icon-box">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <hr className="detail-divider" />

          {/* Host Info Box */}
          <section className="detail-section host-card-box">
            <img 
              src={property.host?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
              alt={property.host?.name || "Host"}
              className="host-avatar-large"
            />
            <div>
              <h3>Hosted by {property.host?.name || "Surendra Sharma"}</h3>
              <p className="host-subtext">Superhost • Joined in 2021 • 98% Response rate</p>
              <p className="host-bio">"Hi, I'm Surendra! I love hosting guests and offering top-rated verified stays with warm hospitality."</p>
            </div>
          </section>

          <hr className="detail-divider" />

          {/* Customer Reviews & Ratings System */}
          <section className="detail-section reviews-section">
            <div className="reviews-header-flex">
              <div>
                <h2>Guest Reviews & Ratings</h2>
                <div className="rating-summary-row">
                  <Star size={20} fill="#FF385C" color="#FF385C" />
                  <span className="rating-num">4.8</span>
                  <span className="rating-count">({reviewsList.length} guest reviews)</span>
                </div>
              </div>

              <button 
                className="btn-secondary add-review-btn" 
                onClick={() => {
                  if (!user) openAuthModal('login');
                  else setShowReviewModal(true);
                }}
              >
                <Plus size={16} />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Reviews Cards List */}
            <div className="reviews-list-grid">
              {reviewsList.map(rev => (
                <div key={rev.id} className="review-card-item">
                  <div className="reviewer-top-row">
                    <img src={rev.avatar} alt={rev.name} className="reviewer-avatar" />
                    <div>
                      <strong>{rev.name}</strong>
                      <div className="reviewer-meta">
                        <div className="stars-row">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < rev.rating ? "#FF385C" : "#E0E0E0"} 
                              color={i < rev.rating ? "#FF385C" : "#E0E0E0"} 
                            />
                          ))}
                        </div>
                        <span>• {rev.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment-txt">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="detail-right-col">
          <BookingWidget 
            property={property} 
            onBookingComplete={onNavigateBookings}
            onRedirectAuth={onNavigateAuth}
          />
        </div>
      </div>

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box review-modal-box">
            <div className="modal-header-row">
              <h3>Write a Guest Review</h3>
              <button className="close-modal-icon-btn" onClick={() => setShowReviewModal(false)}>
                <X size={18} />
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="success-banner">
                <CheckCircle2 size={24} />
                <span>{reviewSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleAddReviewSubmit} className="review-modal-form">
                <div className="rating-select-group">
                  <label>Select Rating (1 to 5 Stars)</label>
                  <div className="interactive-stars-picker">
                    {[1, 2, 3, 4, 5].map(starNum => (
                      <button
                        key={starNum}
                        type="button"
                        className="star-pick-btn"
                        onClick={() => setNewRating(starNum)}
                      >
                        <Star 
                          size={28} 
                          fill={starNum <= newRating ? "#FF385C" : "#E0E0E0"} 
                          color={starNum <= newRating ? "#FF385C" : "#E0E0E0"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="review-input-group">
                  <label>Your Review & Experience</label>
                  <textarea
                    rows="4"
                    placeholder="Share your stay experience, room cleanliness, host hospitality..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary submit-review-btn">
                  Publish Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .detail-page {
          padding: 1.5rem 0 4rem 0;
        }

        .detail-header {
          margin-bottom: 1.5rem;
        }

        .detail-superhost {
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .detail-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .detail-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .meta-dot {
          color: var(--text-light);
        }

        .specs-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .spec-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #F7F7F7;
          border: 1px solid var(--border-light);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-pill);
          font-size: 0.88rem;
          font-weight: 500;
        }

        .detail-content-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          align-items: start;
        }

        .detail-section h2 {
          font-size: 1.35rem;
          margin-bottom: 1rem;
        }

        .description-text {
          font-size: 0.98rem;
          color: var(--text-main);
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }

        .detail-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 2rem 0;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        .amenity-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: #F7F7F7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
        }

        .host-card-box {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          background: #FAF8F6;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid var(--border-light);
        }

        .host-avatar-large {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        .reviews-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .rating-summary-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.25rem;
        }

        .rating-num {
          font-weight: 800;
          font-size: 1.2rem;
        }

        .rating-count {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .add-review-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          font-size: 0.88rem;
        }

        .reviews-list-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        .review-card-item {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .reviewer-top-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .reviewer-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .reviewer-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .stars-row {
          display: flex;
          gap: 0.15rem;
        }

        .review-comment-txt {
          font-size: 0.88rem;
          color: var(--text-main);
          line-height: 1.5;
        }

        .review-modal-box {
          max-width: 460px;
          padding: 2rem;
        }

        .interactive-stars-picker {
          display: flex;
          gap: 0.5rem;
          margin: 0.5rem 0 1rem 0;
        }

        .star-pick-btn {
          background: transparent;
          border: none;
          padding: 0;
        }

        .review-modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .review-input-group label, .rating-select-group label {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .review-input-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }

        .submit-review-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
        }

        @media (max-width: 900px) {
          .detail-content-layout, .reviews-list-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
