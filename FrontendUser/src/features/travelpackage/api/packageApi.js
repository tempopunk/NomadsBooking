const API_BASE_URL = 'http://localhost:8087/api/v1';

const packageApi = {
  searchPackages: async (origin, destination, departureDate) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/package/user/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&departureDate=${departureDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching packages:', error);
      throw error;
    }
  },

  getPackageDetails: async (packageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/package/user/viewpackage?packageId=${packageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch package details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  },

  viewFlight: async (flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/flight/user/flight/viewflight?flightId=${flightId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw error;
    }
  },

  checkout: async (userId, packageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/package/user/checkout?userId=${userId}&packageId=${packageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
  }
};

export default packageApi;