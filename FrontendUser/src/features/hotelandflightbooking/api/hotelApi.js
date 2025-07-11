const API_BASE_URL = 'http://localhost:8087/api/v1/hotel';
const FLIGHT_API_BASE_URL = 'http://localhost:8087/api/v1/flight';
const REVIEW_API_BASE_URL = 'http://localhost:8087/api/v1/review';

const hotelApi = {
  getAverageHotelRating: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${REVIEW_API_BASE_URL}/reviews/hotel/${hotelId}/average-rating`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return 0; // Return 0 if no ratings exist
      }

      const rating = await response.json();
      return rating;
    } catch (error) {
      console.error('Error fetching hotel rating:', error);
      return 0;
    }
  },
  
  getAverageFlightRating: async (flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${REVIEW_API_BASE_URL}/reviews/flight/${flightId}/average-rating`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return 0; // Return 0 if no ratings exist
      }

      const rating = await response.json();
      return rating;
    } catch (error) {
      console.error('Error fetching flight rating:', error);
      return 0;
    }
  },

  getAveragePackageRating: async (packageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${REVIEW_API_BASE_URL}/reviews/package/${packageId}/average-rating`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return 0; // Return 0 if no ratings exist
      }

      const rating = await response.json();
      return rating;
    } catch (error) {
      console.error('Error fetching package rating:', error);
      return 0;
    }
  },

  searchHotels: async (location) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/hotel/search?location=${encodeURIComponent(location)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },

  getHotelImages: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel_agent/hotel/${hotelId}/images`, {
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

  viewRooms: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/hotel/viewrooms?hotelId=${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  getHotelDetails: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/hotel/id?id=${hotelId}`, {
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
      return data;
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      throw error;
    }
  },

  getHotelById: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/hotel/id?id=${id}`, {
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
      return data;
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      throw error;
    }
  },

  getRoomImages: async (roomId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/hotel_agent/room/${roomId}/images`, {
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

  getRoomById: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/room/id?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching room details:', error);
      throw error;
    }
  },

  checkout: async (userId, hotelId, roomId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/hotel/checkout?userId=${userId}&hotelId=${hotelId}&roomId=${roomId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  },

  searchFlights: async (origin, destination, departureDate) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${FLIGHT_API_BASE_URL}/user/flight/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&departureDate=${departureDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },

  checkoutFlight: async (userId, flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${FLIGHT_API_BASE_URL}/user/flight/checkout?userId=${userId}&flightId=${flightId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Flight checkout failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during flight checkout:', error);
      throw error;
    }
  },
};

export default hotelApi;