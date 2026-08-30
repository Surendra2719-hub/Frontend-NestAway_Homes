import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, Clock, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const DashboardPage = ({ onSelectProperty }) => {
  const { user, openAuthModal } = useAuth();
  const { addToast } = useToast();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      setLoading(true);
      const data = await api.getUserBookings(user.id, user.role === 'HOST');
      setBookings(data);
      setLoading(false);
    };
    loadBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking reservation?")) return;
    setCancellingId(bookingId);
    try {
      await api.cancelBooking(bookingId, user.id);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      addToast("Booking reservation cancelled successfully.", "info");
    } catch (err) {
      addToast("Failed to cancel booking", "error");
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>My Bookings & Stays</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem 0' }}>Please log in to view your booked properties and upcoming trips.</p>
        <button className="btn-primary" onClick={() => openAuthModal('login')}>Log In Now</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <h1>My Booked Stays ({bookings.length})</h1>
        <p className="subtitle">Manage your upcoming trips, reservations, and stay history.</p>
      </div>

      {loading ? (
        <p>Loading your stays...</p>
      ) : bookings.length === 0 ? (
        <div className="empty-bookings-box">
          <Calendar size={48} color="#CCCCCC" />
          <h3>No Stays Booked Yet</h3>
          <p>Explore homes across India and book your perfect stay today!</p>
        </div>
      ) : (
        <div className="bookings-grid-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-stay-card">
              <div className="stay-image-box">
                <img 
                  src={booking.coverImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} 
                  alt={booking.propertyTitle} 
                />
                <span className={`status-pill pill-${(booking.status || 'CONFIRMED').toLowerCase()}`}>
                  {booking.status === 'CONFIRMED' ? '🟢 CONFIRMED STAY' : '🔴 CANCELLED'}
                </span>
              </div>

              <div className="stay-info-content">
                <div className="stay-top-row">
                  <div>
                    <h3>{booking.propertyTitle || 'Luxury Home Stay'}</h3>
                    <div className="location-row">
                      <MapPin size={14} />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                  <span className="booking-ref-badge">#NEST-{booking.id}</span>
                </div>

                <div className="stay-details-grid">
                  <div className="detail-item">
                    <span className="item-label">Check-in</span>
                    <strong>{booking.checkIn}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Check-out</span>
                    <strong>{booking.checkOut}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Guests & Occupant</span>
                    <strong>{booking.occupantName || user.name} ({booking.guests || 2} Guests)</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Total Amount Paid</span>
                    <strong className="amount-txt">₹{booking.totalPrice?.toLocaleString() || '10,000'}</strong>
                  </div>
                </div>

                <div className="stay-card-actions">
                  <button 
                    className="btn-secondary view-prop-btn"
                    onClick={() => onSelectProperty(booking.propertyId || 1)}
                  >
                    <span>View Property Details</span>
                    <ArrowRight size={14} />
                  </button>

                  {booking.status !== 'CANCELLED' && (
                    <button 
                      className="cancel-booking-btn"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dashboard-page {
          padding: 3rem 0 5rem 0;
        }

        .dashboard-header {
          margin-bottom: 2.5rem;
        }

        .dashboard-header h1 {
          font-size: 2.2rem;
          margin-bottom: 0.35rem;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .empty-bookings-box {
          background: #FAF9F6;
          border: 2px dashed var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 4rem 2rem;
          text-align: center;
          max-width: 480px;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .bookings-grid-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .booking-stay-card {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: grid;
          grid-template-columns: 280px 1fr;
          transition: var(--transition);
        }

        .booking-stay-card:hover {
          box-shadow: var(--shadow-md);
        }

        .stay-image-box {
          position: relative;
          height: 100%;
          min-height: 200px;
        }

        .stay-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-pill);
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .pill-confirmed {
          color: #059669;
        }

        .pill-cancelled {
          color: #DC2626;
        }

        .stay-info-content {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .stay-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
        }

        .stay-top-row h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
          font-size: 0.88rem;
        }

        .booking-ref-badge {
          background: #F7F7F7;
          border: 1px solid var(--border-medium);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-pill);
          font-size: 0.78rem;
          font-weight: 700;
          color: #FF385C;
        }

        .stay-details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          background: #FAF8F6;
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .item-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .detail-item strong {
          font-size: 0.92rem;
          color: var(--text-main);
          margin-top: 0.15rem;
        }

        .amount-txt {
          color: #FF385C !important;
          font-weight: 800 !important;
        }

        .stay-card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .view-prop-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          font-size: 0.85rem;
        }

        .cancel-booking-btn {
          background: transparent;
          border: 1px solid #EF4444;
          color: #EF4444;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }

        .cancel-booking-btn:hover {
          background: #FEF2F2;
        }

        @media (max-width: 900px) {
          .booking-stay-card {
            grid-template-columns: 1fr;
          }
          .stay-details-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
