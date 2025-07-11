const API_BASE_URL = 'http://localhost:8087/api/v1';

const bookingApi = {
  getPaidBookings: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/user/booking/viewpaid/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return []; // Return empty array for no bookings
      }

      if (!response.ok) {
        throw new Error('Failed to fetch paid bookings');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching paid bookings:', error);
      throw error;
    }
  },

  getPendingBookings: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel/user/booking/viewpending/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return []; // Return empty array for no bookings
      }

      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      throw error;
    }
  }
};

export default bookingApi;