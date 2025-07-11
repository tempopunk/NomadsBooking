const API_BASE_URL = 'http://localhost:8087/api/v1/auth'; // IMPORTANT: Replace with your actual backend URL
 
const api = {
  /**
   * Registers a new user.
   * @param {object} userData - { name, email, passwordHash }
   * @returns {Promise<string>} - Success message or error message.
   */
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
 
      const textResponse = await response.text(); // Read as text as per backend's ResponseEntity<String>
 
      if (!response.ok) {
        let errorMessage = 'User registration failed.';
        try {
            // Attempt to parse as JSON if it's an error from @Valid or a custom exception with JSON response
            const errorJson = JSON.parse(textResponse);
            errorMessage = errorJson.message || errorMessage;
        } catch (e) {
            // If it's not JSON, use the raw text response as the message
            errorMessage = textResponse || errorMessage;
        }
        throw new Error(errorMessage);
      }
 
      return textResponse; // Expected success message "User Registered Successfully"
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
 
  /**
   * Registers a new agent.
   * @param {object} agentData - { name, email, passwordHash, agentType, companyName, address, phoneNumber }
   * @returns {Promise<string>} - Success message or error message.
   */
  registerAgent: async (agentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });
 
      const textResponse = await response.text(); // Read as text
 
      if (!response.ok) {
        let errorMessage = 'Agent registration failed.';
        try {
            const errorJson = JSON.parse(textResponse);
            errorMessage = errorJson.message || errorMessage;
        } catch (e) {
            errorMessage = textResponse || errorMessage;
        }
        throw new Error(errorMessage);
      }
 
      return textResponse; // Expected success message "Agent Registered Successfully"
    } catch (error) {
      console.error('Error registering agent:', error);
      throw error;
    }
  },
 
  /**
   * Logs in a user.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} - { id, name, email, token }
   */
  loginUser: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Get the response as text first
      const textResponse = await response.text();
      
      let data;
      try {
        // Try to parse as JSON
        data = JSON.parse(textResponse);
      } catch (e) {
        // If not JSON, create an error object with the text
        data = { message: textResponse };
      }

      if (!response.ok) {
        // If it's a validation error (400 Bad Request)
        if (response.status === 400 && typeof data === 'object') {
          // The data should already be the validation errors object
          throw new Error(JSON.stringify(data));
        }
        throw new Error(data.message || 'User login failed.');
      }

      // Ensure we have all required fields
      if (!data.id || !data.name || !data.email || !data.token) {
        throw new Error('Invalid response format from server');
      }

      return data; // Expected { id, name, email, token }
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },
 
  /**
   * Logs in an agent.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} - { id, name, email, token }
   */
  loginAgent: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
 
      let data;
      const contentType = response.headers.get('content-type');
      
      // Get the response as text first
      const textResponse = await response.text();
      
      try {
        // Try to parse as JSON
        data = JSON.parse(textResponse);
      } catch (e) {
        // If not JSON, create an error object with the text
        data = { message: textResponse };
      }

      if (!response.ok) {
        // If it's a validation error (400 Bad Request)
        if (response.status === 400 && typeof data === 'object') {
          // The data should already be the validation errors object
          throw new Error(JSON.stringify(data));
        }
        throw new Error(data.message || 'Agent login failed.');
      }

      // Ensure we have all required fields
      if (!data.id || !data.name || !data.email || !data.token || !data.role) {
        throw new Error('Invalid response format from server. Missing required fields.');
      }

      return data;
    } catch (error) {
      console.error('Error logging in agent:', error);
      throw error;
    }
  },
 
  /**
   * Example of a protected endpoint call.
   * Requires a JWT token in the Authorization header.
   * @param {string} token - JWT token
   * @returns {Promise<string>} - Test message
   */
  getHotelAgentTest: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel_agent/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
 
      const textResponse = await response.text();
 
      if (!response.ok) {
        throw new Error(textResponse || 'Failed to access hotel agent test endpoint.');
      }
 
      return textResponse;
    } catch (error) {
      console.error('Error accessing hotel agent test:', error);
      throw error;
    }
  },
 
  /**
   * Example of a protected endpoint call.
   * Requires a JWT token in the Authorization header.
   * @param {string} token - JWT token
   * @returns {Promise<string>} - Test message
   */
  getUserTest: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
 
      const textResponse = await response.text();
 
      if (!response.ok) {
        throw new Error(textResponse || 'Failed to access user test endpoint.');
      }
 
      return textResponse;
    } catch (error) {
      console.error('Error accessing user test:', error);
      throw error;
    }
  },

  /**
   * Updates the user profile.
   * @param {string} userId - The ID of the user
   * @param {object} profileData - The profile data to update
   * @returns {Promise<object>} - The updated user profile
   */
  updateUserProfile: async (userId, profileData) => {
    try {
      const token = localStorage.getItem('authToken');
      // Convert profileData to URLSearchParams for query parameters
      const params = new URLSearchParams({
        name: profileData.name,
        email: profileData.email
      });
      
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}?${params.toString()}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update profile');
      }

      // Return the profile data since the backend returns only a success message
      return {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};
 
export default api;