import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ isModal = false, onClose, initialTab = 'login', onAuthSuccess }) => {
  const { login, register, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'signup'
  const [role, setRole] = useState('GUEST'); // 'GUEST' or 'HOST'
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Invalid email or password');
        } else {
          if (onAuthSuccess) onAuthSuccess();
          if (isModal) closeAuthModal();
        }
      } else {
        const res = await register(fullName, email, password, role);
        if (!res.success) {
          setError(res.message || 'Registration failed');
        } else {
          if (onAuthSuccess) onAuthSuccess();
          if (isModal) closeAuthModal();
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aesthetic-auth-viewport">
      {/* Left 50% Panel - ENTIRE PANEL IS A SEAMLESS FULL-HEIGHT BACKGROUND IMAGE! */}
      <div className="aesthetic-left-full-bg">
        {/* Soft subtle gradient overlay */}
        <div className="bg-subtle-overlay"></div>

        {/* Hanging Ceiling Lamp Fixture */}
        <div className="hanging-pendant-bulb">
          <svg width="80" height="200" viewBox="0 0 100 220" fill="none">
            <line x1="50" y1="0" x2="50" y2="120" stroke="#D4AF37" strokeWidth="2.5" />
            <rect x="42" y="120" width="16" height="14" rx="3" fill="#B8860B" />
            <path d="M20 134 Q50 120 80 134 L90 165 C90 165 50 175 10 165 Z" fill="#FFFFFF" stroke="#E5DCCE" strokeWidth="2" />
            <circle cx="50" cy="172" r="11" fill="#FFF4D0" filter="drop-shadow(0px 8px 24px rgba(255, 200, 80, 0.7))" />
          </svg>
        </div>

        {/* Content rendered DIRECTLY ON TOP of full background image */}
        <div className="left-content-stack">
          {/* Top Brand Logo - Option 1 Geometric House Roof & Gold Nest Emblem */}
          <div className="wall-brand-logo">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L4 17L7.5 19.8L20 9.6L32.5 19.8L36 17L20 4Z" fill="#FF385C" />
              <path d="M8 22C8 28.6274 13.3726 34 20 34C26.6274 34 32 28.6274 32 22H28C28 26.4183 24.4183 30 20 30C15.5817 30 12 26.4183 12 22H8Z" fill="#E2A952" />
              <path d="M20 23L18.8 21.9C14.6 18.1 11.8 15.5 11.8 12.4C11.8 9.9 13.7 8 16.2 8C17.6 8 19 8.65 20 9.7C21 8.65 22.4 8 23.8 8C26.3 8 28.2 9.9 28.2 12.4C28.2 15.5 25.4 18.1 21.2 21.91L20 23Z" fill="#FF385C" />
            </svg>
            <span className="wall-brand-title"><strong>NestAway</strong> Homes</span>
          </div>

          {/* Typography on Background Image */}
          <div className="wall-hero-content">
            <h1 className="wall-welcome">Welcome to</h1>
            <h1 className="wall-brand-name">NestAway Homes</h1>
            <p className="wall-tagline">Find your perfect home<br />anytime, anywhere.</p>
          </div>
        </div>
      </div>

      {/* Right 50% Form Column */}
      <div className="aesthetic-right-form-panel">
        <div className="aesthetic-form-card">
          {/* Tabs */}
          <div className="card-tabs-header">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            >
              Login
              {activeTab === 'login' && <span className="red-tab-bar"></span>}
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
            >
              Sign up
              {activeTab === 'signup' && <span className="red-tab-bar"></span>}
            </button>
          </div>

          {/* Social Auth - ONLY Google */}
          <div className="social-pill-container">
            <button 
              type="button" 
              className="google-pill-button" 
              onClick={() => { setEmail('demo.guest@nestaway.com'); setPassword('guest123'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="form-divider">
            <span>or</span>
          </div>

          {error && (
            <div className="status-banner banner-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="status-banner banner-success">
              <CheckCircle2 size={14} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card-fields-stack">
            {activeTab === 'signup' && (
              <>
                <div className="field-block">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="field-block">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="field-block">
                  <label>I want to join as:</label>
                  <div className="role-buttons-grid">
                    <button
                      type="button"
                      className={`role-select-btn ${role === 'GUEST' ? 'active' : ''}`}
                      onClick={() => setRole('GUEST')}
                    >
                      Guest (Book stays)
                    </button>
                    <button
                      type="button"
                      className={`role-select-btn ${role === 'HOST' ? 'active' : ''}`}
                      onClick={() => setRole('HOST')}
                    >
                      Host (List property)
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="field-block">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-block">
              <div className="flex-label-row">
                <label>Password</label>
                {activeTab === 'login' && (
                  <a href="#forgot" className="forgot-pass-txt" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                )}
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {activeTab === 'signup' && (
              <div className="field-block">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <span className="pass-mismatch-label">⚠️ Passwords do not match</span>
                )}
                {confirmPassword && password === confirmPassword && (
                  <span className="pass-match-label">✓ Passwords match</span>
                )}
              </div>
            )}

            <button type="submit" className="btn-primary main-submit-red" disabled={loading}>
              {loading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Sign up'}
            </button>
          </form>

          <div className="card-footer-note">
            {activeTab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button type="button" className="switch-red-link" onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}>
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" className="switch-red-link" onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}>
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .aesthetic-auth-viewport {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          background: #FFFFFF;
          z-index: 1000;
        }

        .aesthetic-left-full-bg {
          flex: 1;
          height: 100vh;
          background-image: url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80');
          background-size: cover;
          background-position: center bottom;
          position: relative;
          overflow: hidden;
          padding: 3.5rem 4.5rem;
          display: flex;
          flex-direction: column;
        }

        .bg-subtle-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(250, 245, 238, 0.88) 0%, rgba(250, 245, 238, 0.45) 45%, rgba(250, 245, 238, 0.05) 100%);
          z-index: 1;
        }

        .hanging-pendant-bulb {
          position: absolute;
          top: 0;
          right: 90px;
          z-index: 2;
          pointer-events: none;
        }

        .left-content-stack {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
        }

        .wall-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-heading);
          font-size: 1.35rem;
          margin-bottom: 4rem;
        }

        .wall-brand-title strong {
          color: #FF385C;
        }

        .wall-hero-content {
          margin-bottom: 2rem;
        }

        .wall-welcome {
          font-size: 2.6rem;
          font-weight: 700;
          color: #111111;
          line-height: 1.15;
        }

        .wall-brand-name {
          font-size: 2.6rem;
          font-weight: 800;
          color: #FF385C;
          line-height: 1.15;
          margin-bottom: 0.85rem;
        }

        .wall-tagline {
          color: #555555;
          font-size: 1.05rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .aesthetic-right-form-panel {
          flex: 1;
          height: 100vh;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow: hidden;
        }

        .aesthetic-form-card {
          width: 100%;
          max-width: 440px;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 1.85rem 2.25rem;
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
          border: 1px solid #F3F3F3;
        }

        .card-tabs-header {
          display: flex;
          justify-content: center;
          gap: 3.5rem;
          border-bottom: 1px solid #EBEBEB;
          margin-bottom: 1.25rem;
        }

        .tab-btn {
          font-size: 1.1rem;
          font-weight: 600;
          color: #717171;
          padding-bottom: 0.5rem;
          position: relative;
        }

        .tab-btn.active {
          color: #FF385C;
          font-weight: 700;
        }

        .red-tab-bar {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #FF385C;
          border-radius: 2px;
        }

        .social-pill-container {
          margin-bottom: 0.85rem;
        }

        .google-pill-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          color: #222222;
          background: white;
          transition: var(--transition);
        }

        .google-pill-button:hover {
          background: #F9F9F9;
        }

        .form-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 0.5rem 0 0.85rem 0;
          color: #B0B0B0;
          font-size: 0.82rem;
        }

        .form-divider::before, .form-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #EBEBEB;
        }

        .form-divider span {
          padding: 0 0.75rem;
        }

        .status-banner {
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }

        .banner-error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
        }

        .banner-success {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
        }

        .card-fields-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .field-block label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #222222;
        }

        .field-block input {
          width: 100%;
          padding: 0.55rem 0.85rem;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .field-block input:focus {
          border-color: #FF385C;
          box-shadow: 0 0 0 3px rgba(255, 56, 92, 0.1);
        }

        .flex-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .forgot-pass-txt {
          font-size: 0.78rem;
          color: #FF385C;
          font-weight: 600;
        }

        .role-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;
        }

        .role-select-btn {
          padding: 0.4rem;
          font-size: 0.75rem;
          border: 1px solid #E0E0E0;
          border-radius: 6px;
          font-weight: 500;
          background: white;
        }

        .role-select-btn.active {
          border-color: #FF385C;
          background: #FFF0F3;
          color: #FF385C;
          font-weight: 600;
        }

        .pass-mismatch-label {
          color: #DC2626;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .pass-match-label {
          color: #059669;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .main-submit-red {
          width: 100%;
          padding: 0.78rem;
          font-size: 0.95rem;
          font-weight: 600;
          background: #FF385C;
          color: white;
          border-radius: 10px;
          margin-top: 0.35rem;
          box-shadow: 0 4px 14px rgba(255, 56, 92, 0.35);
          transition: var(--transition);
        }

        .main-submit-red:hover {
          background: #E00B41;
        }

        .card-footer-note {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.82rem;
          color: #717171;
        }

        .switch-red-link {
          color: #FF385C;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .aesthetic-auth-viewport {
            flex-direction: column;
            overflow-y: auto;
          }
          .aesthetic-left-full-bg {
            display: none;
          }
          .aesthetic-right-form-panel {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
