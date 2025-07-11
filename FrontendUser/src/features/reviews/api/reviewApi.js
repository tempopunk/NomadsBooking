const API_BASE_URL = 'http://localhost:8087/api/v1/review';

const reviewApi = {
  submitReview: async (reviewData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  alreadyReviewed: async (userId, hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/hreviews/exists/${userId}/${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check review status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking review status:', error);
      throw error;
    }
  },

  getReviewsByHotel: async (hotelId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reviews/hotel/${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel reviews');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching hotel reviews:', error);
      throw error;
    }
  },

  alreadyReviewedPackage: async (userId, packageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/previews/exists/${userId}/${packageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check package review status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking package review status:', error);
      throw error;
    }
  },

  getReviewsByPackage: async (packageId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reviews/package/${packageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch package reviews');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching package reviews:', error);
      throw error;
    }
  },

  alreadyReviewedFlight: async (userId, flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/freviews/exists/${userId}/${flightId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check flight review status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking flight review status:', error);
      throw error;
    }
  },

  getReviewsByFlight: async (flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/reviews/flight/${flightId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight reviews');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching flight reviews:', error);
      throw error;
    }
  },
};

export default reviewApi;