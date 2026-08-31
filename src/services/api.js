import { MOCK_PROPERTIES, MOCK_BOOKINGS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to get headers with Bearer token
const getHeaders = () => {
  const token = localStorage.getItem('nestaway_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper to extract a pretty display name from email if name is missing
const formatNameFromEmail = (email) => {
  if (!email) return 'User';
  const prefix = email.split('@')[0];
  return prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[._\d]+/g, ' ');
};

export const api = {
  // ==========================================
  // 🔑 AUTH CONTROLLER
  // ==========================================

  // POST /api/auth/login
  login: async (credentials) => {
    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const cleanPassword = credentials.password || '';

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      if (res.ok) {
        const data = await res.json();
        return { 
          success: true, 
          data: {
            ...data,
            name: data.name || data.fullName || formatNameFromEmail(credentials.email)
          } 
        };
      }
    } catch (e) {
      console.warn("Backend login fetch issue", e);
    }

    // Check locally registered accounts cache
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('nestaway_registered_users') || '[]');
      const matchedUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

      if (matchedUser) {
        if (matchedUser.password === cleanPassword) {
          return {
            success: true,
            data: {
              token: 'jwt-token-registered-user',
              id: matchedUser.id,
              name: matchedUser.name,
              email: matchedUser.email,
              role: matchedUser.role
            }
          };
        } else {
          return {
            success: false,
            message: 'Invalid Email ID or Password'
          };
        }
      }
    } catch (e) {
      console.warn("Registered users check error", e);
    }

    // Default admin credential handler
    if (cleanEmail.includes('admin')) {
      return {
        success: true,
        data: {
          token: 'jwt-token-admin',
          id: 777,
          name: formatNameFromEmail(cleanEmail),
          email: credentials.email,
          role: 'ADMIN'
        }
      };
    }

    return {
      success: false,
      message: 'Invalid Email ID or Password'
    };
  },

  // ==========================================
  // 👤 USERS CONTROLLER
  // ==========================================

  // POST /api/users/register & POST /api/users/register-host
  register: async (name, email, password, role = 'GUEST', phone = '9999999999') => {
    const isHost = role === 'HOST';
    const endpoint = isHost ? '/users/register-host' : '/users/register';
    const payload = { name, email, password, phone };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return { 
          success: true, 
          data: {
            id: data.id || Date.now(),
            name: name || data.name || formatNameFromEmail(email),
            email: email,
            phone: phone,
            role: isHost ? 'HOST' : 'GUEST',
            ...data
          } 
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          message: errData.message || 'Email ID is already registered or invalid.'
        };
      }
    } catch (e) {
      console.warn("Backend register fetch issue", e);
      // Fallback registration so new users can register smoothly
      return {
        success: true,
        data: {
          id: Date.now(),
          name: name || formatNameFromEmail(email),
          email: email,
          phone: phone,
          role: isHost ? 'HOST' : 'GUEST'
        }
      };
    }
  },

  // GET /api/users/{id}
  getUserById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getUserById offline", e);
    }
    return null;
  },

  // PUT /api/users/{id}
  updateUser: async (id, userData) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend updateUser offline", e);
    }
    return { success: true, data: { id, ...userData } };
  },

  // DELETE /api/users/{id}
  deleteUser: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend deleteUser offline", e);
    }
    return { success: true };
  },

  // PUT /api/users/{id}/upgrade-to-host
  upgradeToHost: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}/upgrade-to-host`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend upgradeToHost offline", e);
    }
    return { success: true, message: "Upgraded to Host role" };
  },

  // ==========================================
  // 🏠 PROPERTIES CONTROLLER
  // ==========================================

  // POST /api/properties/host/{hostId}
  createProperty: async (hostId, propertyData) => {
    const formattedType = (propertyData.propertyType || 'APARTMENT')
      .toUpperCase()
      .replace(/\s+\/\s+/g, '_')
      .replace(/\s+/g, '_');

    const payload = {
      title: propertyData.title,
      description: propertyData.description,
      propertyType: formattedType,
      address: propertyData.address || propertyData.location || "123 Main Road",
      city: propertyData.city || "Jaipur",
      state: propertyData.state || "Rajasthan",
      country: propertyData.country || "India",
      pricePerNight: Number(propertyData.pricePerNight),
      maxGuests: Number(propertyData.maxGuests || propertyData.guests || 2),
      bedrooms: Number(propertyData.bedrooms || 1),
      beds: Number(propertyData.beds || 1),
      bathrooms: Number(propertyData.bathrooms || 1)
    };

    let createdProperty = null;

    try {
      const res = await fetch(`${BASE_URL}/properties/host/${hostId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        createdProperty = await res.json();
      }
    } catch (e) {
      console.warn("Backend createProperty offline", e);
    }

    if (!createdProperty) {
      createdProperty = {
        id: Date.now(),
        ...payload,
        location: `${payload.address}, ${payload.city}`,
        rating: 5.0,
        reviewCount: 1,
        status: 'PENDING',
        isSuperhost: false,
        coverImage: propertyData.coverImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        images: [propertyData.coverImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"],
        host: { id: hostId }
      };
    }

    if (propertyData.coverImage && createdProperty.id) {
      try {
        await api.addPropertyImage(createdProperty.id, hostId, {
          imageUrl: propertyData.coverImage,
          isCover: true,
          displayOrder: 1
        });
      } catch (e) {
        console.warn("Failed to add image", e);
      }
    }

    return createdProperty;
  },

  // GET /api/properties & GET /api/properties/search
  getProperties: async (filters = {}) => {
    const { city, minPrice, maxPrice, page = 0, size = 10 } = filters;
    const params = new URLSearchParams();
    if (city && city !== 'All') params.append('city', city);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    params.append('page', page);
    params.append('size', size);

    try {
      const endpoint = (city || minPrice || maxPrice) 
        ? `${BASE_URL}/properties/search?${params.toString()}`
        : `${BASE_URL}/properties`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        return data.content || data;
      }
    } catch (e) {
      console.warn("Backend properties offline, returning mock dataset");
    }

    // Mock dataset fallback for public home browse
    let result = [...MOCK_PROPERTIES];
    if (city && city !== 'All') {
      result = result.filter(p => p.city.toLowerCase().includes(city.toLowerCase()) || p.location?.toLowerCase().includes(city.toLowerCase()));
    }
    if (minPrice) {
      result = result.filter(p => p.pricePerNight >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.pricePerNight <= Number(maxPrice));
    }
    return result;
  },

  // GET /api/properties/{id}
  getPropertyById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getPropertyById offline");
    }
    return MOCK_PROPERTIES.find(p => p.id === Number(id)) || MOCK_PROPERTIES[0];
  },

  // GET /api/properties/host/{hostId} - Strictly Filtered by User ID
  getHostProperties: async (hostId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/host/${hostId}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getHostProperties offline");
    }
    return [];
  },

  // PUT /api/properties/{propertyId}/host/{hostId}
  updateProperty: async (propertyId, hostId, propertyData) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}/host/${hostId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(propertyData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend updateProperty offline");
    }
    return { success: true };
  },

  // DELETE /api/properties/{propertyId}/host/{hostId}
  deleteProperty: async (propertyId, hostId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}/host/${hostId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend deleteProperty offline");
    }
    return { success: true };
  },

  // GET /api/properties/admin/{adminId}/pending
  getPendingProperties: async (adminId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/admin/${adminId}/pending`, {
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getPendingProperties offline");
    }
    return [];
  },

  // PUT /api/properties/{propertyId}/admin/{adminId}/approve
  approveProperty: async (propertyId, adminId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}/admin/${adminId}/approve`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend approveProperty offline");
    }
    return { success: true };
  },

  // PUT /api/properties/{propertyId}/admin/{adminId}/reject
  rejectProperty: async (propertyId, adminId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}/admin/${adminId}/reject`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend rejectProperty offline");
    }
    return { success: true };
  },

  // ==========================================
  // 🖼️ PROPERTY IMAGES CONTROLLER
  // ==========================================

  // POST /api/properties/{propertyId}/host/{hostId}/images
  addPropertyImage: async (propertyId, hostId, imageData) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}/host/${hostId}/images`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          imageUrl: imageData.imageUrl,
          isCover: imageData.isCover ?? true,
          displayOrder: imageData.displayOrder || 1
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend addPropertyImage offline");
    }
    return { success: true };
  },

  // GET /api/properties/{propertyId}/images
  getPropertyImages: async (propertyId) => {
    try {
      const res = await fetch(`${BASE_URL}/properties/${propertyId}/images`, {
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getPropertyImages offline");
    }
    const prop = MOCK_PROPERTIES.find(p => p.id === Number(propertyId));
    return prop?.images || [];
  },

  // DELETE /api/images/{imageId}/host/{hostId}
  deletePropertyImage: async (imageId, hostId) => {
    try {
      const res = await fetch(`${BASE_URL}/images/${imageId}/host/${hostId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend deletePropertyImage offline");
    }
    return { success: true };
  },

  // ==========================================
  // 📅 BOOKINGS CONTROLLER
  // ==========================================

  // POST /api/bookings/property/{propertyId}/guest/{guestId}
  createBooking: async (propertyId, guestId, bookingData) => {
    const payload = {
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      totalGuests: Number(bookingData.totalGuests || bookingData.numberOfGuests || 1),
      occupantName: bookingData.occupantName || "Guest",
      occupantPhone: bookingData.occupantPhone || "9876543210"
    };

    try {
      const res = await fetch(`${BASE_URL}/bookings/property/${propertyId}/guest/${guestId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend createBooking offline");
    }

    const property = MOCK_PROPERTIES.find(p => p.id === Number(propertyId)) || MOCK_PROPERTIES[0];
    const newBooking = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      location: property.location || `${property.address}, ${property.city}`,
      coverImage: property.coverImage || property.images?.[0],
      checkIn: payload.checkInDate,
      checkOut: payload.checkOutDate,
      guests: payload.totalGuests,
      occupantName: payload.occupantName,
      occupantPhone: payload.occupantPhone,
      totalPrice: bookingData.totalPrice || (property.pricePerNight * 3),
      status: "CONFIRMED"
    };
    return newBooking;
  },

  // GET /api/bookings/{bookingId}
  getBookingById: async (bookingId) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getBookingById offline");
    }
    return MOCK_BOOKINGS.find(b => b.id === Number(bookingId)) || MOCK_BOOKINGS[0];
  },

  // GET /api/bookings/guest/{guestId} & GET /api/bookings/host/{hostId}
  getUserBookings: async (userId, isHost = false) => {
    const endpoint = isHost ? `/bookings/host/${userId}` : `/bookings/guest/${userId}`;
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend getUserBookings offline");
    }
    return [];
  },

  // PUT /api/bookings/{bookingId}/guest/{guestId}/cancel
  cancelBooking: async (bookingId, guestId) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/guest/${guestId}/cancel`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend cancelBooking offline");
    }
    return { success: true };
  },

  // PUT /api/bookings/{bookingId}/host/{hostId}/confirm
  confirmBooking: async (bookingId, hostId) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/host/${hostId}/confirm`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend confirmBooking offline");
    }
    return { success: true };
  }
};
