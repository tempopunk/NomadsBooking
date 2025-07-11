const API_BASE_URL = 'http://localhost:8087/api/v1';

const hotelAgentApi = {
  getHotelId: async (agentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/auth/hotel_agent/getHotelId/${agentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel ID');
      }

      const hotelId = await response.json();
      return hotelId;
    } catch (error) {
      console.error('Error fetching hotel ID:', error);
      throw error;
    }
  },

  getHotelDetails: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/id?id=${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel details');
      }

      const data = await response.json();
      console.log('Hotel details:', data); // Debugging line
      return data;
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      throw error;
    }
  },

  getHotelBookings: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/booking/byHotelId/${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return []; // Return empty array if no bookings found
      }

      if (!response.ok) {
        throw new Error('Failed to fetch hotel bookings');
      }

      const data = await response.json();
      console.log('Hotel bookings:', data); // Debugging line
      return data;
    } catch (error) {
      console.error('Error fetching hotel bookings:', error);
      throw error;
    }
  },

  addRoom: async (hotelId, roomData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/addroom?hotelId=${hotelId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error('Failed to add room');
      }

      const data = await response.text;
      return data;
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  },

  deleteRoom: async (roomId, hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/deleteroom?roomId=${roomId}&hotelId=${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Response details:', response);
        throw new Error('Failed to delete room');
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  addHotel: async (agentId, hotelData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/addhotel/${agentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: hotelData.name,
          location: hotelData.location,
          type: hotelData.type,
          lowerCost: hotelData.lowerCost,
          upperCost: hotelData.upperCost,
          costRange: hotelData.costRange
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add hotel');
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error adding hotel:', error);
      throw error;
    }
  },

  deleteHotel: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete hotel');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  },

  uploadHotelImages: async (hotelId, files) => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/${hotelId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  getHotelImages: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/${hotelId}/images`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel images');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching hotel images:', error);
      throw error;
    }
  },

  deleteHotelImage: async (hotelId, imageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/hotel/${hotelId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  getRoomImages: async (roomId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/room/${roomId}/images`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room images');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching room images:', error);
      throw error;
    }
  },

  uploadRoomImages: async (roomId, files) => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/${roomId}/hotel/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading room images:', error);
      throw error;
    }
  },

  deleteRoomImage: async (roomId, imageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/hotel_agent/${roomId}/hotel/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete room image');
      }

      return true;
    } catch (error) {
      console.error('Error deleting room image:', error);
      throw error;
    }
  },

  getAgentSupportTickets: async (agentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/support/agent/support-tickets/${agentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch support tickets');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      throw error;
    }
  },
};

export default hotelAgentApi;