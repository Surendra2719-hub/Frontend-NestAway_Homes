import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nestaway_token') || '');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'
  
  // Saved Wishlist Property IDs
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nestaway_wishlist');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });

  useEffect(() => {
    localStorage.setItem('nestaway_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load user session from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nestaway_user');
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token || 'demo-token');
      localStorage.setItem('nestaway_user', JSON.stringify(res.data));
      localStorage.setItem('nestaway_token', res.data.token || 'demo-token');
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password, role = 'GUEST') => {
    const res = await api.register(name, email, password, role);
    if (res.success && res.data) {
      const newUser = {
        ...res.data,
        name: name || res.data.name || email.split('@')[0],
        role: role
      };
      setUser(newUser);
      setToken('demo-token');
      localStorage.setItem('nestaway_user', JSON.stringify(newUser));
      localStorage.setItem('nestaway_token', 'demo-token');

      // Save registered user credentials locally so login always recognizes newly created accounts
      try {
        const savedList = JSON.parse(localStorage.getItem('nestaway_registered_users') || '[]');
        const updatedList = savedList.filter(u => u.email.toLowerCase() !== email.toLowerCase());
        updatedList.push({
          id: newUser.id,
          name: newUser.name,
          email: email.toLowerCase(),
          password: password,
          role: role
        });
        localStorage.setItem('nestaway_registered_users', JSON.stringify(updatedList));
      } catch (e) {
        console.warn("Could not cache registered user", e);
      }

      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('nestaway_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('nestaway_user');
    localStorage.removeItem('nestaway_token');
  };

  const toggleWishlist = (propertyId) => {
    setWishlist(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const isInWishlist = (propertyId) => {
    return wishlist.includes(propertyId);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      updateUserProfile,
      wishlist,
      toggleWishlist,
      isInWishlist,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
