import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Building, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AdminPage = ({ onSelectProperty }) => {
  const { user } = useAuth();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadPending = async () => {
    setLoading(true);
    const adminId = user?.id || 777;
    const data = await api.getPendingProperties(adminId);
    setPendingProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, [user]);

  const handleApprove = async (propertyId) => {
    const adminId = user?.id || 777;
    await api.approveProperty(propertyId, adminId);
    setMessage(`Property ID #${propertyId} has been APPROVED!`);
    loadPending();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReject = async (propertyId) => {
    const adminId = user?.id || 777;
    await api.rejectProperty(propertyId, adminId);
    setMessage(`Property ID #${propertyId} has been REJECTED.`);
    loadPending();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-page container">
      <div className="admin-header-card">
        <div className="admin-title-row">
          <div className="admin-badge">
            <ShieldCheck size={24} color="#FF385C" />
            <h2>Admin Property Approval Dashboard</h2>
          </div>
          <button className="btn-outline refresh-btn" onClick={loadPending}>
            <RefreshCw size={16} /> Refresh Queue
          </button>
        </div>
        <p className="admin-subtitle">
          Review and approve pending property submissions from Hosts before they appear publicly on NestAway Homes.
        </p>

        {message && (
          <div className="admin-alert-msg">
            <span>{message}</span>
          </div>
        )}
      </div>

      <div className="pending-queue-section">
        <h3>Pending Properties Queue ({pendingProperties.length})</h3>

        {loading ? (
          <p>Loading approval queue...</p>
        ) : pendingProperties.length === 0 ? (
          <div className="empty-admin-box glass-card">
            <CheckCircle size={48} color="#10B981" />
            <h4>All Clear!</h4>
            <p>There are no pending property submissions awaiting admin approval right now.</p>
          </div>
        ) : (
          <div className="pending-grid">
            {pendingProperties.map(p => (
              <div key={p.id} className="pending-card glass-card">
                <div className="pending-img-box">
                  <img src={p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} alt={p.title} />
                  <span className="badge-pending">PENDING APPROVAL</span>
                </div>

                <div className="pending-content">
                  <h4>{p.title}</h4>
                  <p className="pending-location">{p.address || p.location || p.city}, {p.city}</p>
                  <p className="pending-price"><strong>₹{p.pricePerNight?.toLocaleString()}</strong> / night</p>
                  
                  <div className="pending-specs">
                    <span>{p.propertyType || 'Apartment'}</span> • 
                    <span> {p.bedrooms || 1} Bed</span> • 
                    <span> {p.bathrooms || 1} Bath</span> • 
                    <span> Max {p.maxGuests || p.guests || 2} Guests</span>
                  </div>

                  <p className="pending-desc">{p.description}</p>

                  <div className="admin-action-row">
                    <button 
                      className="btn-primary approve-btn"
                      onClick={() => handleApprove(p.id)}
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    
                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(p.id)}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-page {
          padding: 2.5rem 0;
        }

        .admin-header-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2rem;
          margin-bottom: 2.5rem;
          box-shadow: var(--shadow-sm);
        }

        .admin-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .admin-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .admin-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .refresh-btn {
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
        }

        .admin-alert-msg {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-top: 1rem;
          font-weight: 600;
        }

        .pending-queue-section h3 {
          font-size: 1.3rem;
          margin-bottom: 1.25rem;
        }

        .empty-admin-box {
          text-align: center;
          padding: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .pending-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }

        .pending-card {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1.25rem;
          padding: 1.25rem;
          overflow: hidden;
        }

        .pending-img-box {
          position: relative;
          height: 100%;
          min-height: 180px;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .pending-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pending-img-box .badge-pending {
          position: absolute;
          top: 10px;
          left: 10px;
        }

        .pending-content h4 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .pending-location {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .pending-price {
          font-size: 0.95rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .pending-specs {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .pending-desc {
          font-size: 0.85rem;
          color: var(--text-main);
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .admin-action-row {
          display: flex;
          gap: 0.75rem;
        }

        .approve-btn {
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
          background: #10B981;
          border-color: #10B981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .approve-btn:hover {
          background: #059669;
        }

        .btn-reject {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1.25rem;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          background: #FEF2F2;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          transition: var(--transition);
        }

        .btn-reject:hover {
          background: #FEE2E2;
        }

        @media (max-width: 900px) {
          .pending-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
