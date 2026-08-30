import React, { useState } from 'react';
import { User, Mail, Phone, Shield, CheckCircle2, Award, Heart, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfilePage = ({ onNavigateWishlist, onNavigateBookings, onNavigateHost, onNavigateAdmin }) => {
  const { user, updateUserProfile, wishlist } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '9999999999');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg('');

    try {
      const res = await api.updateUser(user.id, { name, email, phone });
      updateUserProfile({ name, email, phone });
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgradeToHost = async () => {
    setIsUpgrading(true);
    try {
      await api.upgradeToHost(user.id);
      updateUserProfile({ role: 'HOST' });
      setSuccessMsg("Account successfully upgraded to HOST role!");
    } catch (err) {
      console.error("Upgrade error", err);
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Please Log In</h2>
        <p>You need to log in to access your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="profile-page container">
      <div className="profile-layout-grid">
        {/* Left Column - User Info Card */}
        <div className="profile-left-card">
          <div className="profile-avatar-big">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <h2>{user.name}</h2>
          <p className="user-email-text">{user.email}</p>
          
          <div className={`role-badge-pill ${user.role === 'ADMIN' ? 'role-admin' : ''}`}>
            <Shield size={14} />
            <span>{user.role === 'ADMIN' ? 'ADMIN SUPERUSER' : `${user.role} Account`}</span>
          </div>

          <hr className="profile-card-divider" />

          <div className="profile-stats-grid">
            <button className="stat-box" onClick={onNavigateWishlist}>
              <Heart size={20} color="#FF385C" />
              <strong>{wishlist.length}</strong>
              <span>Saved Stays</span>
            </button>

            <button className="stat-box" onClick={onNavigateBookings}>
              <Calendar size={20} color="#FF385C" />
              <strong>Stays</strong>
              <span>My Bookings</span>
            </button>
          </div>

          {/* Render Upgrade to Host banner ONLY for GUEST users (Not Admin & Not Host) */}
          {user.role === 'GUEST' && (
            <div className="upgrade-host-banner">
              <Award size={24} color="#FF385C" />
              <div>
                <strong>Become a Host</strong>
                <p>List your home & earn income</p>
              </div>
              <button 
                className="btn-primary upgrade-now-btn" 
                onClick={handleUpgradeToHost}
                disabled={isUpgrading}
              >
                {isUpgrading ? 'Upgrading...' : 'Upgrade Role'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Edit Profile Form */}
        <div className="profile-right-card">
          <h3>Account Settings & Profile</h3>
          <p className="subtitle">Manage your personal information and contact preferences.</p>

          {successMsg && (
            <div className="success-banner">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="profile-form-stack">
            <div className="form-group-field">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-field">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-field">
              <label>Mobile Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary save-profile-btn" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {user.role === 'ADMIN' && (
            <div className="host-quick-actions">
              <hr className="profile-card-divider" />
              <h4>Admin Management</h4>
              <button className="btn-primary admin-dash-btn" onClick={onNavigateAdmin}>
                <Shield size={16} />
                <span>Open Admin Control & Approval Operations</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {user.role === 'HOST' && (
            <div className="host-quick-actions">
              <hr className="profile-card-divider" />
              <h4>Host Quick Actions</h4>
              <button className="btn-secondary host-dash-btn" onClick={onNavigateHost}>
                <span>Manage My Property Listings & Add New Home</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .profile-page {
          padding: 3rem 0 5rem 0;
        }

        .profile-layout-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        .profile-left-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 2.5rem 1.5rem;
          text-align: center;
          box-shadow: var(--shadow-md);
        }

        .profile-avatar-big {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-size: 2.2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem auto;
          box-shadow: 0 8px 20px rgba(255, 56, 92, 0.3);
        }

        .profile-left-card h2 {
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
        }

        .user-email-text {
          color: var(--text-muted);
          font-size: 0.88rem;
          margin-bottom: 1rem;
        }

        .role-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #FFF0F3;
          color: #FF385C;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .role-admin {
          background: #222222 !important;
          color: white !important;
        }

        .profile-card-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 1.5rem 0;
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .stat-box {
          background: #FAF9F6;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-box strong {
          font-size: 1.2rem;
          color: var(--text-main);
        }

        .stat-box span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .upgrade-host-banner {
          margin-top: 1.5rem;
          background: linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%);
          border: 1px solid #FFCCD5;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          text-align: center;
        }

        .upgrade-host-banner strong {
          display: block;
          font-size: 0.95rem;
          margin-top: 0.35rem;
        }

        .upgrade-host-banner p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
        }

        .upgrade-now-btn {
          width: 100%;
          padding: 0.6rem;
          font-size: 0.88rem;
        }

        .profile-right-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
        }

        .profile-right-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .profile-right-card .subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        .success-banner {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .profile-form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group-field label {
          font-size: 0.85rem;
          font-weight: 600;
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

        .input-with-icon input {
          width: 100%;
          padding: 0.7rem 0.85rem 0.7rem 2.5rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.92rem;
        }

        .save-profile-btn {
          padding: 0.85rem;
          font-size: 1rem;
          margin-top: 0.5rem;
          width: 220px;
        }

        .host-quick-actions h4 {
          font-size: 1.05rem;
          margin-bottom: 0.75rem;
        }

        .admin-dash-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.85rem 1.25rem;
          background: #222222;
          border-color: #222222;
        }

        .host-dash-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.85rem 1.25rem;
        }

        @media (max-width: 900px) {
          .profile-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
