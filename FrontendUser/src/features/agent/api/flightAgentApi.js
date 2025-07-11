const API_BASE_URL = 'http://localhost:8087/api/v1';

const flightAgentApi = {
  getFlightIds: async (agentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/auth/flight_agent/getFlightIds/${agentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight IDs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching flight IDs:', error);
      throw error;
    }
  },

  getFlightBookings: async (flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/flight/flight_agent/booking/byFlightId/${flightId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return []; // Return empty array if no bookings found
      }

      if (!response.ok) {
        throw new Error('Failed to fetch flight bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching flight bookings:', error);
      throw error;
    }
  },

  addFlight: async (agentId, flightData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/flight/flight_agent/addflight/${agentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: flightData.companyName,
          origin: flightData.origin,
          destination: flightData.destination,
          departureDate: flightData.departureDate,
          departureTime: flightData.departureTime,
          arrivalTime: flightData.arrivalTime,
          price: parseFloat(flightData.price)
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to add flight');
      }

      return await response.text();
    } catch (error) {
      console.error('Error adding flight:', error);
      throw error;
    }
  },

  getFlightDetails: async (flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/flight/both/flight/viewflight?flightId=${flightId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching flight details:', error);
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
  }
};

export default flightAgentApi;