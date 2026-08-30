import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { HostPage } from './pages/HostPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { api } from './services/api';

const DEFAULT_FILTERS = {
  city: 'All',
  minPrice: 0,
  maxPrice: 10000
};

function MainApp() {
  const { authModalTab } = useAuth();
  const [activePage, setActivePage] = useState('home'); // 'home' | 'explore' | 'detail' | 'bookings' | 'host' | 'admin' | 'auth' | 'profile' | 'wishlist'
  const [selectedPropertyId, setSelectedPropertyId] = useState(1);
  const [properties, setProperties] = useState([]);
  
  // Default filters reset on initial page load & refresh
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Fetch properties whenever filters update
  useEffect(() => {
    const loadProperties = async () => {
      const data = await api.getProperties(filters);
      setProperties(data);
    };
    loadProperties();
  }, [filters]);

  const handleSearchFromHero = ({ city, minPrice, maxPrice }) => {
    setFilters(prev => ({ ...prev, city, minPrice: minPrice || 0, maxPrice: maxPrice || 10000 }));
    setActivePage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCity = (cityName) => {
    setFilters(prev => ({ ...prev, city: cityName }));
    setActivePage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSelectProperty = (id) => {
    setSelectedPropertyId(id);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            properties={properties}
            onSearch={handleSearchFromHero}
            onSelectCity={handleSelectCity}
            onSelectProperty={handleSelectProperty}
            onNavigateExplore={() => setActivePage('explore')}
            onBecomeHost={() => setActivePage('host')}
          />
        );
      case 'explore':
        return (
          <ExplorePage
            properties={properties}
            filters={filters}
            onFilterChange={(newF) => setFilters(prev => ({ ...prev, ...newF }))}
            onResetFilters={handleResetFilters}
            onSelectProperty={handleSelectProperty}
          />
        );
      case 'detail':
        return (
          <PropertyDetailPage
            propertyId={selectedPropertyId}
            onBack={() => setActivePage('home')}
            onNavigateBookings={() => setActivePage('bookings')}
            onNavigateAuth={() => setActivePage('auth')}
          />
        );
      case 'bookings':
        return (
          <DashboardPage
            onSelectProperty={handleSelectProperty}
          />
        );
      case 'host':
        return (
          <HostPage
            onPropertyCreated={() => setActivePage('bookings')}
          />
        );
      case 'admin':
        return (
          <AdminPage
            onSelectProperty={handleSelectProperty}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            onNavigateWishlist={() => setActivePage('wishlist')}
            onNavigateBookings={() => setActivePage('bookings')}
            onNavigateHost={() => setActivePage('host')}
            onNavigateAdmin={() => setActivePage('admin')}
          />
        );
      case 'wishlist':
        return (
          <WishlistPage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onNavigateExplore={() => setActivePage('explore')}
          />
        );
      case 'auth':
        return (
          <AuthModal
            isModal={false}
            initialTab={authModalTab}
            onAuthSuccess={() => setActivePage('home')}
          />
        );
      default:
        return (
          <HomePage
            properties={properties}
            onSearch={handleSearchFromHero}
            onSelectCity={handleSelectCity}
            onSelectProperty={handleSelectProperty}
            onNavigateExplore={() => setActivePage('explore')}
            onBecomeHost={() => setActivePage('host')}
          />
        );
    }
  };

  return (
    <div className="app-main-layout">
      {/* Hide Navbar & Footer on Auth Page so it takes over full 100vh viewport matching Reference Image 1 */}
      {activePage !== 'auth' && (
        <Navbar activePage={activePage} setActivePage={setActivePage} />
      )}

      <main className="app-main-content">
        {renderActivePage()}
      </main>

      {activePage !== 'auth' && (
        <Footer setActivePage={setActivePage} />
      )}

      {/* Mobile Sticky Bottom Navigation Bar for Smartphone users */}
      {activePage !== 'auth' && (
        <MobileNav activePage={activePage} setActivePage={setActivePage} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
