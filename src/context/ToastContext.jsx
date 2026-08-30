import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Notifications Overlay Container */}
      <div className="toast-container-root">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="#10B981" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
            {toast.type === 'info' && <Info size={18} color="#3B82F6" />}
            <span className="toast-msg">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="toast-close-btn">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .toast-container-root {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          z-index: 9999;
          pointer-events: none;
        }

        .toast-item {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          min-width: 280px;
          max-width: 400px;
          animation: slideUp 0.3s ease forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toast-msg {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          flex: 1;
        }

        .toast-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 0.2rem;
          display: flex;
          align-items: center;
        }

        .toast-success {
          border-left: 4px solid #10B981;
        }

        .toast-error {
          border-left: 4px solid #EF4444;
        }

        .toast-info {
          border-left: 4px solid #3B82F6;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
