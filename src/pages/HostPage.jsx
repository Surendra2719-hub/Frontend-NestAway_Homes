import React, { useState, useEffect } from 'react';
import { 
  Home, DollarSign, Shield, CheckCircle, Upload, Plus, Edit3, Trash2, 
  Image as ImageIcon, Link as LinkIcon, X, Calendar, User, Phone, 
  Star, Eye, Check, AlertTriangle, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const HostPage = ({ onPropertyCreated }) => {
  const { user, openAuthModal } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'bookings' | 'add-new'

  // Host Properties & Bookings List
  const [hostProperties, setHostProperties] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingProperty, setEditingProperty] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Image Manager Modal State
  const [imageManagerProperty, setImageManagerProperty] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  // New Property Form State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [country, setCountry] = useState('India');
  const [pricePerNight, setPricePerNight] = useState('2500');
  const [maxGuests, setMaxGuests] = useState('2');
  const [bedrooms, setBedrooms] = useState('1');
  const [beds, setBeds] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [uploadMode, setUploadMode] = useState('FILE'); // 'FILE' | 'URL'
  const [coverImage, setCoverImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Host Data
  useEffect(() => {
    const loadHostData = async () => {
      setLoading(true);
      const hostId = user?.id || 101;
      const props = await api.getHostProperties(hostId);
      const bookings = await api.getUserBookings(hostId, true);
      setHostProperties(props);
      setHostBookings(bookings);
      setLoading(false);
    };
    loadHostData();
  }, [user]);

  // Image File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setCoverImage(url);
    setImagePreview(url);
  };

  // Submit New Listing
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('signup');
      return;
    }

    setIsSubmitting(true);
    try {
      const propertyData = {
        title,
        description,
        propertyType,
        address: address || "123 MI Road",
        city,
        state,
        country,
        pricePerNight: Number(pricePerNight),
        maxGuests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        coverImage: coverImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
      };

      const res = await api.createProperty(user.id, propertyData);
      if (res) {
        addToast("Property created! Status is PENDING admin approval.", "success");
        setHostProperties([res, ...hostProperties]);
        setActiveTab('listings');
        // Reset form
        setTitle('');
        setCoverImage('');
        setImagePreview('');
        setDescription('');
      }
    } catch (err) {
      addToast("Failed to create property", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Property Handler
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property listing?")) return;
    const hostId = user?.id || 101;
    await api.deleteProperty(propertyId, hostId);
    setHostProperties(prev => prev.filter(p => p.id !== propertyId));
    addToast("Property listing deleted.", "info");
  };

  // Edit Property Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const hostId = user?.id || 101;
    await api.updateProperty(editingProperty.id, hostId, {
      title: editTitle,
      pricePerNight: Number(editPrice),
      description: editDescription
    });
    setHostProperties(prev => prev.map(p => p.id === editingProperty.id ? { ...p, title: editTitle, pricePerNight: Number(editPrice), description: editDescription } : p));
    setEditingProperty(null);
    addToast("Property details updated successfully!", "success");
  };

  // Confirm Received Booking
  const handleConfirmBooking = async (bookingId) => {
    const hostId = user?.id || 101;
    await api.confirmBooking(bookingId, hostId);
    setHostBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b));
    addToast("Booking request confirmed!", "success");
  };

  // Calculate Total Earnings
  const totalEarnings = hostBookings.reduce((sum, b) => sum + (b.totalPrice || 5000), 0);

  return (
    <div className="host-dashboard-page container">
      {/* Host Banner Header */}
      <div className="host-banner-card">
        <div className="banner-user-info">
          <div className="host-avatar-ring">
            {user?.name ? user.name[0].toUpperCase() : 'H'}
          </div>
          <div>
            <h1>Welcome, {user?.name || 'Surendra (Host)'}! 👋</h1>
            <div className="host-badges-row">
              <span className="badge-superhost">VERIFIED HOST</span>
              <span className="badge-rating"><Star size={14} fill="#FF385C" color="#FF385C" /> 4.9 Superhost</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="host-stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Revenue</span>
            <strong className="stat-value">₹{totalEarnings.toLocaleString()}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Listings</span>
            <strong className="stat-value">{hostProperties.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Guest Bookings</span>
            <strong className="stat-value">{hostBookings.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Tabbed Navigation */}
      <div className="dashboard-tabs-bar">
        <button 
          className={`dash-tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          <Home size={18} />
          <span>My Listings ({hostProperties.length})</span>
        </button>

        <button 
          className={`dash-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={18} />
          <span>Received Bookings ({hostBookings.length})</span>
        </button>

        <button 
          className={`dash-tab add-new-tab ${activeTab === 'add-new' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-new')}
        >
          <Plus size={18} />
          <span>Add New Home</span>
        </button>
      </div>

      {/* TAB 1: MY LISTINGS MANAGER */}
      {activeTab === 'listings' && (
        <div className="listings-manager-section">
          {loading ? (
            <p>Loading properties...</p>
          ) : hostProperties.length === 0 ? (
            <div className="empty-state-box">
              <Home size={48} color="#CCCCCC" />
              <h3>No Property Listings Yet</h3>
              <p>Start hosting by adding your first home listing to receive guest bookings.</p>
              <button className="btn-primary" onClick={() => setActiveTab('add-new')}>
                <Plus size={16} />
                <span>Add Your First Home</span>
              </button>
            </div>
          ) : (
            <div className="host-properties-grid">
              {hostProperties.map(property => (
                <div key={property.id} className="host-property-card">
                  <div className="card-img-box">
                    <img src={property.coverImage || property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"} alt={property.title} />
                    
                    {/* Status Badge */}
                    <span className={`status-badge badge-${(property.status || 'APPROVED').toLowerCase()}`}>
                      {property.status === 'PENDING' ? '🟡 PENDING APPROVAL' : property.status === 'REJECTED' ? '🔴 REJECTED' : '🟢 APPROVED'}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3>{property.title}</h3>
                    <p className="location-txt">{property.location || property.city}</p>
                    <div className="price-tag">
                      <strong>₹{property.pricePerNight?.toLocaleString()}</strong> / night
                    </div>

                    <div className="host-card-actions">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => {
                          setEditingProperty(property);
                          setEditTitle(property.title);
                          setEditPrice(property.pricePerNight);
                          setEditDescription(property.description || '');
                        }}
                      >
                        <Edit3 size={15} />
                        <span>Edit</span>
                      </button>

                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECEIVED GUEST BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="received-bookings-section">
          {hostBookings.length === 0 ? (
            <div className="empty-state-box">
              <Calendar size={48} color="#CCCCCC" />
              <h3>No Guest Bookings Received Yet</h3>
              <p>When guests book your homes, their reservations will appear here.</p>
            </div>
          ) : (
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Property Home</th>
                    <th>Occupant / Guest</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hostBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.propertyTitle || 'Jaipur Luxury Home'}</strong>
                        <div className="sub-txt">{booking.location}</div>
                      </td>
                      <td>
                        <div><strong>{booking.occupantName || 'Rohit Sharma'}</strong></div>
                        <div className="sub-txt">{booking.occupantPhone || '9876543210'}</div>
                      </td>
                      <td>
                        <div>{booking.checkIn} to {booking.checkOut}</div>
                        <div className="sub-txt">{booking.guests || 2} Guests</div>
                      </td>
                      <td>
                        <strong>₹{booking.totalPrice?.toLocaleString() || '10,000'}</strong>
                      </td>
                      <td>
                        <span className={`status-pill pill-${(booking.status || 'CONFIRMED').toLowerCase()}`}>
                          {booking.status || 'CONFIRMED'}
                        </span>
                      </td>
                      <td>
                        {booking.status !== 'CONFIRMED' ? (
                          <button 
                            className="btn-primary confirm-btn-small" 
                            onClick={() => handleConfirmBooking(booking.id)}
                          >
                            <Check size={14} />
                            <span>Confirm</span>
                          </button>
                        ) : (
                          <span className="ok-tag">✓ Confirmed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADD NEW LISTING FORM */}
      {activeTab === 'add-new' && (
        <div className="add-listing-form-container">
          <div className="form-header">
            <h2>Add New Property Listing</h2>
            <p>Publish your home for thousands of verified guests across India.</p>
          </div>

          <form onSubmit={handleCreateSubmit} className="host-property-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Property Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cozy 2BHK Villa in Vaishali Nagar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Property Type</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="APARTMENT">APARTMENT</option>
                    <option value="VILLA">VILLA</option>
                    <option value="INDEPENDENT_HOUSE">INDEPENDENT HOUSE</option>
                    <option value="PG_HOSTEL">PG / HOSTEL</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price per Night (₹)</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 MI Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State & Country</label>
                <div className="form-grid-2">
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-4">
              <div className="form-group">
                <label>Max Guests</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Beds</label>
                <input
                  type="number"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Dual Mode Image Upload */}
            <div className="form-group image-upload-group">
              <div className="upload-header-row">
                <label>Property Cover Image</label>
                <div className="upload-toggle-pills">
                  <button
                    type="button"
                    className={`toggle-pill ${uploadMode === 'FILE' ? 'active' : ''}`}
                    onClick={() => setUploadMode('FILE')}
                  >
                    <Upload size={14} />
                    <span>Upload Device File</span>
                  </button>
                  <button
                    type="button"
                    className={`toggle-pill ${uploadMode === 'URL' ? 'active' : ''}`}
                    onClick={() => setUploadMode('URL')}
                  >
                    <LinkIcon size={14} />
                    <span>Paste Image URL</span>
                  </button>
                </div>
              </div>

              {uploadMode === 'FILE' ? (
                <div className="file-drop-zone">
                  <input
                    type="file"
                    accept="image/*"
                    id="property-file-input"
                    className="file-hidden-input"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="property-file-input" className="file-drop-label">
                    <Upload size={32} className="upload-icon-style" />
                    <span>Click to choose photo from your device</span>
                    <span className="file-formats-hint">Supports PNG, JPG, JPEG, WEBP</span>
                  </label>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/photo1.jpg"
                  value={coverImage}
                  onChange={handleUrlChange}
                />
              )}

              {/* Live Preview Box */}
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Property Preview" />
                  <button type="button" className="remove-preview-btn" onClick={() => { setCoverImage(''); setImagePreview(''); }}>
                    <X size={16} />
                  </button>
                  <span className="preview-badge">✓ Image Ready</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                placeholder="Describe your space, surroundings, amenities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary submit-property-btn" disabled={isSubmitting}>
              <Plus size={18} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Property for Approval'}</span>
            </button>
          </form>
        </div>
      )}

      {/* EDIT LISTING MODAL */}
      {editingProperty && (
        <div className="modal-backdrop">
          <div className="modal-content-box edit-modal-box">
            <div className="modal-header-row">
              <h3>Edit Property Listing</h3>
              <button className="close-modal-icon-btn" onClick={() => setEditingProperty(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-form-stack">
              <div className="form-group">
                <label>Property Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price per Night (₹)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .host-dashboard-page {
          padding: 2.5rem 0 5rem 0;
        }

        .host-banner-card {
          background: linear-gradient(135deg, #FFF0F3 0%, #FAF6F0 100%);
          border: 1px solid #FFCCD5;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          box-shadow: 0 8px 30px rgba(255, 56, 92, 0.08);
        }

        .banner-user-info {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .host-avatar-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #FF385C;
          color: white;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(255, 56, 92, 0.3);
        }

        .banner-user-info h1 {
          font-size: 1.8rem;
          margin-bottom: 0.35rem;
        }

        .host-badges-row {
          display: flex;
          gap: 0.6rem;
        }

        .badge-superhost {
          background: #FF385C;
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-pill);
        }

        .badge-rating {
          background: white;
          color: var(--text-main);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          border: 1px solid var(--border-light);
        }

        .host-stats-grid {
          display: flex;
          gap: 1.25rem;
        }

        .stat-card {
          background: white;
          border: 1px solid var(--border-light);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          text-align: center;
          min-width: 140px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.03);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          display: block;
        }

        .stat-value {
          font-size: 1.4rem;
          color: var(--text-main);
          font-family: var(--font-heading);
        }

        .dashboard-tabs-bar {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
        }

        .dash-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
        }

        .dash-tab.active {
          background: #FFF0F3;
          color: #FF385C;
        }

        .add-new-tab {
          margin-left: auto;
          background: #FF385C;
          color: white;
        }

        .add-new-tab:hover {
          background: #E00B41;
        }

        .host-properties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .host-property-card {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .card-img-box {
          position: relative;
          height: 190px;
        }

        .card-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-pill);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .card-body {
          padding: 1.25rem;
        }

        .card-body h3 {
          font-size: 1.05rem;
          margin-bottom: 0.35rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .location-txt {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .price-tag {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .price-tag strong {
          color: var(--text-main);
          font-size: 1.1rem;
        }

        .host-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.55rem;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-medium);
          background: white;
        }

        .edit-btn:hover {
          background: #F7F7F7;
          border-color: #3B82F6;
          color: #3B82F6;
        }

        .delete-btn:hover {
          background: #FEF2F2;
          border-color: #EF4444;
          color: #EF4444;
        }

        .empty-state-box {
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

        .bookings-table-container {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow-x: auto;
          box-shadow: var(--shadow-sm);
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .bookings-table th, .bookings-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.9rem;
        }

        .bookings-table th {
          background: #FAF8F6;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .sub-txt {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .status-pill {
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .pill-confirmed {
          background: #ECFDF5;
          color: #059669;
        }

        .confirm-btn-small {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.75rem;
          font-size: 0.78rem;
        }

        .ok-tag {
          color: #059669;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .add-listing-form-container {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
        }

        .form-header {
          margin-bottom: 1.5rem;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr;
          gap: 1.25rem;
        }

        .form-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
        }

        .form-group input, .form-group select, .form-group textarea {
          padding: 0.65rem 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }

        .upload-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .upload-toggle-pills {
          display: flex;
          gap: 0.5rem;
        }

        .toggle-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          font-size: 0.78rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-pill);
          background: white;
        }

        .toggle-pill.active {
          background: #FFF0F3;
          border-color: #FF385C;
          color: #FF385C;
          font-weight: 600;
        }

        .file-drop-zone {
          border: 2px dashed #E0E0E0;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          text-align: center;
          background: #FAF8F6;
        }

        .file-hidden-input {
          display: none;
        }

        .file-drop-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .upload-icon-style {
          color: #FF385C;
        }

        .image-preview-container {
          position: relative;
          margin-top: 1rem;
          height: 180px;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .image-preview-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-preview-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #10B981;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-pill);
        }

        .submit-property-btn {
          padding: 1rem;
          font-size: 1.05rem;
          margin-top: 1rem;
        }

        .edit-modal-box {
          max-width: 480px;
          padding: 2rem;
        }

        .edit-form-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 900px) {
          .host-banner-card {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }
          .host-properties-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
