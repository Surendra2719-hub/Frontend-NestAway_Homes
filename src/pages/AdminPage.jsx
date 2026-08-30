import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Building, Clock, RefreshCw, Trash2, Check, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const AdminPage = ({ onSelectProperty }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'all-approved'
  const [allProperties, setAllProperties] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const adminId = user?.id || 777;
    const pendingData = await api.getPendingProperties(adminId);
    const allData = await api.getProperties({});
    setPendingProperties(pendingData);
    setAllProperties(allData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleApprove = async (propertyId) => {
    const adminId = user?.id || 777;
    await api.approveProperty(propertyId, adminId);
    addToast(`Property ID #${propertyId} has been APPROVED!`, "success");
    loadData();
  };

  const handleReject = async (propertyId) => {
    const adminId = user?.id || 777;
    await api.rejectProperty(propertyId, adminId);
    addToast(`Property ID #${propertyId} has been REJECTED.`, "info");
    loadData();
  };

  const handleDeleteApprovedByAdmin = async (propertyId, hostId = 101) => {
    if (!window.confirm("Admin Action: Are you sure you want to delete/revoke this listing from NestAway Homes?")) return;
    await api.deleteProperty(propertyId, hostId);
    addToast(`Admin deleted Property ID #${propertyId}.`, "info");
    loadData();
  };

  const approvedListings = allProperties.filter(p => p.status !== 'PENDING' && p.status !== 'REJECTED');

  return (
    <div className="admin-page container">
      <div className="admin-header-card">
        <div className="admin-title-row">
          <div className="admin-badge">
            <ShieldCheck size={28} color="#FF385C" />
            <div>
              <h2>Admin Operations & Listing Manager</h2>
              <span className="admin-role-badge">ADMIN CONTROL PANEL</span>
            </div>
          </div>
          <button className="btn-outline refresh-btn" onClick={loadData}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>
        <p className="admin-subtitle">
          Manage all host submissions, approve pending requests, and delete/revoke any published home listing across NestAway Homes.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs-bar">
        <button 
          className={`admin-tab-btn ${adminTab === 'pending' ? 'active' : ''}`}
          onClick={() => setAdminTab('pending')}
        >
          <Clock size={16} />
          <span>Pending Submissions ({pendingProperties.length})</span>
        </button>

        <button 
          className={`admin-tab-btn ${adminTab === 'all-approved' ? 'active' : ''}`}
          onClick={() => setAdminTab('all-approved')}
        >
          <Building size={16} />
          <span>All Live Approved Homes ({approvedListings.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING QUEUE */}
      {adminTab === 'pending' && (
        <div className="pending-queue-section">
          {loading ? (
            <p>Loading pending queue...</p>
          ) : pendingProperties.length === 0 ? (
            <div className="empty-admin-box glass-card">
              <CheckCircle size={48} color="#10B981" />
              <h4>All Clear!</h4>
              <p>There are no pending property submissions awaiting approval right now.</p>
            </div>
          ) : (
            <div className="pending-grid">
              {pendingProperties.map(p => (
                <div key={p.id} className="pending-card glass-card">
                  <div className="pending-img-box">
                    <img src={p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} alt={p.title} />
                    <span className="badge-pending">🟡 PENDING APPROVAL</span>
                  </div>

                  <div className="pending-content">
                    <h4>{p.title}</h4>
                    <p className="pending-location">{p.address || p.location || p.city}, {p.city}</p>
                    <p className="pending-price"><strong>₹{p.pricePerNight?.toLocaleString()}</strong> / night</p>
                    
                    <div className="pending-specs">
                      <span>Host ID: #{p.host?.id || 101}</span> • <span>{p.propertyType || 'Apartment'}</span>
                    </div>

                    <div className="admin-action-row">
                      <button 
                        className="btn-primary approve-btn"
                        onClick={() => handleApprove(p.id)}
                      >
                        <CheckCircle size={15} /> Approve
                      </button>
                      
                      <button 
                        className="btn-reject"
                        onClick={() => handleReject(p.id)}
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL APPROVED HOMES (WITH ADMIN DELETE) */}
      {adminTab === 'all-approved' && (
        <div className="all-approved-section">
          {approvedListings.length === 0 ? (
            <div className="empty-admin-box glass-card">
              <Building size={48} color="#CCCCCC" />
              <h4>No Approved Homes Listed</h4>
            </div>
          ) : (
            <div className="admin-properties-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property Home</th>
                    <th>City / Location</th>
                    <th>Host Name</th>
                    <th>Price / Night</th>
                    <th>Status</th>
                    <th>Admin Delete Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedListings.map(property => (
                    <tr key={property.id}>
                      <td className="prop-title-cell">
                        <img src={property.coverImage || property.images?.[0]} alt={property.title} className="thumb-mini" />
                        <div>
                          <strong>{property.title}</strong>
                          <div className="sub-txt">ID: #{property.id}</div>
                        </div>
                      </td>
                      <td>{property.location || property.city}</td>
                      <td>{property.host?.name || 'Surendra (Host)'}</td>
                      <td><strong>₹{property.pricePerNight?.toLocaleString()}</strong></td>
                      <td><span className="badge-confirmed">🟢 APPROVED</span></td>
                      <td>
                        <button 
                          className="admin-delete-btn"
                          onClick={() => handleDeleteApprovedByAdmin(property.id, property.host?.id)}
                          title="Admin Revoke & Delete Listing"
                        >
                          <Trash2 size={14} />
                          <span>Delete Listing</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-page {
          padding: 2.5rem 0 5rem 0;
        }

        .admin-header-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2rem;
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

        .admin-role-badge {
          background: #FFF0F3;
          color: #FF385C;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-pill);
        }

        .admin-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .admin-tabs-bar {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
        }

        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
        }

        .admin-tab-btn.active {
          background: #FFF0F3;
          color: #FF385C;
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
          grid-template-columns: 180px 1fr;
          gap: 1.25rem;
          padding: 1.25rem;
          overflow: hidden;
        }

        .pending-img-box {
          position: relative;
          height: 100%;
          min-height: 150px;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .pending-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pending-content h4 {
          font-size: 1.05rem;
          margin-bottom: 0.25rem;
        }

        .pending-location {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
        }

        .pending-price {
          font-size: 0.95rem;
          color: #FF385C;
          margin-bottom: 0.35rem;
        }

        .pending-specs {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
        }

        .admin-action-row {
          display: flex;
          gap: 0.75rem;
        }

        .approve-btn {
          padding: 0.45rem 1rem;
          font-size: 0.82rem;
          background: #10B981;
          border-color: #10B981;
        }

        .btn-reject {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 1rem;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          background: #FEF2F2;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.82rem;
        }

        .admin-properties-table-container {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow-x: auto;
          box-shadow: var(--shadow-sm);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th, .admin-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.9rem;
        }

        .admin-table th {
          background: #FAF8F6;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .prop-title-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .thumb-mini {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .sub-txt {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .admin-delete-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          background: #FEF2F2;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .admin-delete-btn:hover {
          background: #DC2626;
          color: white;
          border-color: #DC2626;
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
