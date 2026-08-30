import React from 'react';
import { Home, Compass, Heart, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = ({ activePage, setActivePage }) => {
  const { user, wishlist, openAuthModal } = useAuth();

  return (
    <div className="mobile-bottom-nav">
      <button 
        className={`mobile-tab ${activePage === 'home' ? 'active' : ''}`}
        onClick={() => setActivePage('home')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button 
        className={`mobile-tab ${activePage === 'explore' ? 'active' : ''}`}
        onClick={() => setActivePage('explore')}
      >
        <Compass size={20} />
        <span>Explore</span>
      </button>

      <button 
        className={`mobile-tab ${activePage === 'wishlist' ? 'active' : ''}`}
        onClick={() => setActivePage('wishlist')}
      >
        <div className="tab-icon-badge-wrapper">
          <Heart size={20} />
          {wishlist.length > 0 && <span className="tab-badge">{wishlist.length}</span>}
        </div>
        <span>Saved</span>
      </button>

      <button 
        className={`mobile-tab ${activePage === 'bookings' ? 'active' : ''}`}
        onClick={() => {
          if (!user) openAuthModal('login');
          else setActivePage('bookings');
        }}
      >
        <Calendar size={20} />
        <span>Stays</span>
      </button>

      <button 
        className={`mobile-tab ${activePage === 'profile' || activePage === 'auth' ? 'active' : ''}`}
        onClick={() => {
          if (!user) setActivePage('auth');
          else setActivePage('profile');
        }}
      >
        <User size={20} />
        <span>{user ? 'Account' : 'Log in'}</span>
      </button>

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #FFFFFF;
          border-top: 1px solid var(--border-light);
          box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
          z-index: 999;
          justify-content: space-around;
          align-items: center;
          padding: 0 0.5rem;
        }

        .mobile-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          color: #717171;
          font-size: 0.72rem;
          font-weight: 500;
          background: transparent;
          border: none;
          flex: 1;
        }

        .mobile-tab.active {
          color: #FF385C;
          font-weight: 700;
        }

        .tab-icon-badge-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .tab-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: #FF385C;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};
