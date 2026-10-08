import api from './api';

const propertyService = {
  // Properties
  async getProperties(params = {}) {
    const res = await api.get('/properties', { params });
    return res.data || [];
  },

  async searchProperties(params = {}) {
    const res = await api.get('/properties', { params });
    return {
      properties: res.data || [],
      meta: res.meta || {
        total: (res.data || []).length,
        count: (res.data || []).length,
        page: 1,
        limit: 12,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  },

  async getFilterMeta() {
    const res = await api.get('/properties/filters/meta');
    return res.data || null;
  },

  async getPropertyById(id) {
    const res = await api.get(`/properties/${id}`);
    return res.data || null;
  },

  async createProperty(data) {
    const res = await api.post('/properties', data);
    return res.data;
  },

  async updateProperty(id, data) {
    const res = await api.put(`/properties/${id}`, data);
    return res.data;
  },

  async deleteProperty(id) {
    const res = await api.delete(`/properties/${id}`);
    return res.data;
  },

  // Amenities
  async getAmenities() {
    const res = await api.get('/amenities');
    return res.data || [];
  },

  async updatePropertyAmenities(propertyId, amenityIds) {
    const res = await api.put(`/properties/${propertyId}/amenities`, { amenityIds });
    return res.data || [];
  },

  // Rooms
  async getRoomsByProperty(propertyId) {
    const res = await api.get(`/properties/${propertyId}/rooms`);
    return res.data || [];
  },

  async createRoom(propertyId, roomData) {
    const res = await api.post(`/properties/${propertyId}/rooms`, roomData);
    return res.data;
  },

  async updateRoom(roomId, roomData) {
    const res = await api.put(`/rooms/${roomId}`, roomData);
    return res.data;
  },

  async deleteRoom(roomId) {
    const res = await api.delete(`/rooms/${roomId}`);
    return res.data;
  },

  // Images
  async getImages(propertyId) {
    const res = await api.get(`/properties/${propertyId}/images`);
    return res.data || [];
  },

  async addImage(propertyId, imageData) {
    const res = await api.post(`/properties/${propertyId}/images`, imageData);
    return res.data;
  },

  async deleteImage(propertyId, imageId) {
    const res = await api.delete(`/properties/${propertyId}/images/${imageId}`);
    return res.data;
  },

  // Admin
  async adminGetAllProperties(params = {}) {
    const res = await api.get('/admin/properties', { params });
    return res.data || [];
  },

  async adminVerifyProperty(id, status, comments = '') {
    const res = await api.patch(`/admin/properties/${id}/verification`, { status, comments });
    return res.data;
  },
};

export default propertyService;