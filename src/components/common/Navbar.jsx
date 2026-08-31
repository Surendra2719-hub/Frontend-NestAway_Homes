import React, { useState } from 'react';
import { User, LogOut, Shield, PlusCircle, Heart, ChevronDown, Menu, X, Home, Compass, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout, openAuthModal, wishlist } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo - Option 1 Geometric House Roof & Gold Nest Emblem */}
        <button 
          className="brand-logo-btn" 
          onClick={() => handleNavClick('home')}
        >
          <div className="logo-svg-wrapper">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L4 17L7.5 19.8L20 9.6L32.5 19.8L36 17L20 4Z" fill="#FF385C" />
              <path d="M8 22C8 28.6274 13.3726 34 20 34C26.6274 34 32 28.6274 32 22H28C28 26.4183 24.4183 30 20 30C15.5817 30 12 26.4183 12 22H8Z" fill="#E2A952" />
              <path d="M20 23L18.8 21.9C14.6 18.1 11.8 15.5 11.8 12.4C11.8 9.9 13.7 8 16.2 8C17.6 8 19 8.65 20 9.7C21 8.65 22.4 8 23.8 8C26.3 8 28.2 9.9 28.2 12.4C28.2 15.5 25.4 18.1 21.2 21.91L20 23Z" fill="#FF385C" />
            </svg>
          </div>
          <span className="brand-name">
            <strong>NestAway</strong> Homes
          </span>
        </button>

        {/* Center Nav Links - Desktop Only */}
        <nav className="center-nav-menu desktop-only">
          <button 
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activePage === 'explore' ? 'active' : ''}`}
            onClick={() => handleNavClick('explore')}
          >
            Explore
          </button>
          
          <button 
            className={`nav-link wishlist-nav-link ${activePage === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleNavClick('wishlist')}
          >
            <Heart size={16} fill={wishlist.length > 0 ? "#FF385C" : "none"} color="#FF385C" />
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span className="wishlist-badge">{wishlist.length}</span>
            )}
          </button>
        </nav>

        {/* Right Actions - Desktop Only */}
        <div className="right-nav-actions desktop-only">
          {user?.role === 'ADMIN' ? (
            <button 
              className="btn-primary admin-nav-btn" 
              onClick={() => handleNavClick('admin')}
            >
              <Shield size={16} />
              <span>Admin Panel</span>
            </button>
          ) : user?.role === 'HOST' ? (
            <button 
              className="btn-secondary host-btn-small" 
              onClick={() => handleNavClick('host')}
            >
              <PlusCircle size={16} />
              <span>Host Dashboard</span>
            </button>
          ) : (
            <button 
              className="host-link-btn" 
              onClick={() => handleNavClick('host')}
            >
              Become a Host
            </button>
          )}

          {/* User Auth Dropdown */}
          {user ? (
            <div className="user-menu-wrapper">
              <button 
                className="user-pill-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar-circle">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="user-firstname">{user.name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu" onClick={() => setDropdownOpen(false)}>
                  <div className="dropdown-user-header">
                    <strong>{user.name}</strong>
                    <span className="user-role-tag">{user.role}</span>
                  </div>
                  <hr className="dropdown-divider" />

                  {user.role === 'ADMIN' && (
                    <button onClick={() => handleNavClick('admin')} className="dropdown-item admin-highlight">
                      <Shield size={16} />
                      <span>Admin Operations Dashboard</span>
                    </button>
                  )}
                  
                  <button onClick={() => handleNavClick('profile')} className="dropdown-item">
                    <User size={16} />
                    <span>My Profile & Settings</span>
                  </button>

                  <button onClick={() => handleNavClick('bookings')} className="dropdown-item">
                    <Calendar size={16} />
                    <span>My Bookings</span>
                  </button>

                  <button onClick={() => handleNavClick('wishlist')} className="dropdown-item">
                    <Heart size={16} />
                    <span>Saved Wishlist ({wishlist.length})</span>
                  </button>

                  <hr className="dropdown-divider" />
                  
                  <button onClick={logout} className="dropdown-item logout-btn">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-auth-buttons">
              <button 
                className="btn-secondary nav-login-btn" 
                onClick={() => handleNavClick('auth')}
              >
                Log in
              </button>
              <button 
                className="btn-primary nav-signup-btn" 
                onClick={() => handleNavClick('auth')}
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Mobile 3-Line Hamburger Icon Button (Mobile Only) */}
        <button 
          className="mobile-hamburger-btn mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} color="#222" /> : <Menu size={26} color="#222" />}
        </button>
      </div>

      {/* Mobile Slide-Down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              {user ? (
                <div className="mobile-user-card">
                  <div className="avatar-circle-lg">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <strong>{user.name}</strong>
                    <span className="user-role-tag-sm">{user.role}</span>
                  </div>
                </div>
              ) : (
                <div className="mobile-guest-header">
                  <span>Welcome to NestAway Homes</span>
                </div>
              )}
              <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Role-Based Primary Action */}
              {user?.role === 'ADMIN' ? (
                <button className="btn-primary drawer-action-btn admin-color" onClick={() => handleNavClick('admin')}>
                  <Shield size={18} />
                  <span>Admin Panel</span>
                </button>
              ) : user?.role === 'HOST' ? (
                <button className="btn-secondary drawer-action-btn host-color" onClick={() => handleNavClick('host')}>
                  <PlusCircle size={18} />
                  <span>Host Dashboard</span>
                </button>
              ) : (
                <button className="btn-primary drawer-action-btn" onClick={() => handleNavClick('host')}>
                  <PlusCircle size={18} />
                  <span>Become a Host</span>
                </button>
              )}

              <hr className="drawer-divider" />

              {/* Navigation Links */}
              <button className={`drawer-nav-item ${activePage === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
                <Home size={18} />
                <span>Home Page</span>
              </button>

              <button className={`drawer-nav-item ${activePage === 'explore' ? 'active' : ''}`} onClick={() => handleNavClick('explore')}>
                <Compass size={18} />
                <span>Explore Stays</span>
              </button>

              <button className={`drawer-nav-item ${activePage === 'wishlist' ? 'active' : ''}`} onClick={() => handleNavClick('wishlist')}>
                <Heart size={18} color="#FF385C" />
                <span>Saved Wishlist ({wishlist.length})</span>
              </button>

              {user && (
                <>
                  <button className={`drawer-nav-item ${activePage === 'bookings' ? 'active' : ''}`} onClick={() => handleNavClick('bookings')}>
                    <Calendar size={18} />
                    <span>My Bookings</span>
                  </button>

                  <button className={`drawer-nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => handleNavClick('profile')}>
                    <User size={18} />
                    <span>My Profile & Settings</span>
                  </button>
                </>
              )}

              <hr className="drawer-divider" />

              {/* Auth Action Buttons */}
              {user ? (
                <button className="drawer-nav-item logout-red" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="mobile-auth-grid">
                  <button className="btn-secondary full-btn" onClick={() => handleNavClick('auth')}>
                    Log in
                  </button>
                  <button className="btn-primary full-btn" onClick={() => handleNavClick('auth')}>
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          z-index: 900;
          height: 72px;
          display: flex;
          align-items: center;
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .brand-logo-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .logo-svg-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .brand-name strong {
          color: var(--primary);
        }

        .center-nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: none;
          padding: 0.5rem 0;
          position: relative;
          cursor: pointer;
          transition: var(--transition);
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
        }

        .wishlist-nav-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .wishlist-badge {
          background: #FF385C;
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-pill);
        }

        .right-nav-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .admin-nav-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          font-size: 0.88rem;
          background: #222222;
          border-color: #222222;
        }

        .host-link-btn {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
          background: transparent;
          border: none;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-pill);
          cursor: pointer;
        }

        .host-btn-small {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.85rem;
          font-size: 0.85rem;
        }

        .guest-auth-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-login-btn, .nav-signup-btn {
          padding: 0.55rem 1.25rem;
          font-size: 0.9rem;
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-pill-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem 0.35rem 0.35rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-pill);
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          cursor: pointer;
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .user-firstname {
          font-weight: 600;
          font-size: 0.88rem;
        }

        .user-dropdown-menu {
          position: absolute;
          top: 50px;
          right: 0;
          width: 230px;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem 0;
          z-index: 1000;
        }

        .dropdown-user-header {
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
        }

        .user-role-tag {
          font-size: 0.72rem;
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
        }

        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 0.35rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
          padding: 0.65rem 1rem;
          font-size: 0.88rem;
          color: var(--text-main);
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #F7F7F7;
        }

        .admin-highlight {
          color: #D97706;
          font-weight: 600;
        }

        .logout-btn {
          color: #DC2626;
        }

        /* Mobile Hamburger & Drawer Styles */
        .mobile-only {
          display: none;
        }

        .desktop-only {
          display: flex;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }

        .mobile-hamburger-btn {
          background: transparent;
          border: none;
          padding: 0.4rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .mobile-drawer-content {
          width: 85%;
          max-width: 320px;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          animation: slideLeft 0.25s ease;
          overflow: hidden;
        }

        .mobile-drawer-header {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-user-card {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .avatar-circle-lg {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .user-role-tag-sm {
          display: block;
          font-size: 0.68rem;
          color: var(--primary);
          font-weight: 700;
        }

        .close-drawer-btn {
          background: transparent;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
        }

        .mobile-drawer-body {
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: hidden;
        }

        .drawer-action-btn {
          width: 100%;
          padding: 0.6rem 0.85rem;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border-radius: var(--radius-md);
        }

        .drawer-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 0.25rem 0;
        }

        .drawer-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-main);
          border-radius: var(--radius-md);
          text-align: left;
          width: 100%;
        }

        .drawer-nav-item:hover, .drawer-nav-item.active {
          background: #F7F7F7;
          color: var(--primary);
        }

        .logout-red {
          color: #DC2626;
        }

        .mobile-auth-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .full-btn {
          width: 100%;
          padding: 0.6rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </header>
  );
};
