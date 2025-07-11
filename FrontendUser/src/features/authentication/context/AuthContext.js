import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from localStorage only once
  useEffect(() => {
    if (!initialized) {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = {
          id: localStorage.getItem('userId'),
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
          role: localStorage.getItem('userRole'),
          token
        };
        
        // Only set user if we have all required fields
        if (userData.id && userData.name && userData.email && userData.token) {
          setUser(userData);
        } else {
          // Clear incomplete auth state
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
        }
      }
      setInitialized(true);
      setLoading(false);
    }
  }, [initialized]);

  const login = async (loginFunction, email, password) => {
    try {
      setLoading(true);
      const response = await loginFunction(email, password);
      
      if (response && response.token) {
        const userData = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
          token: response.token
        };

        // Validate required fields
        const requiredFields = ['id', 'name', 'email', 'token'];
        const missingFields = requiredFields.filter(field => !userData[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Store in localStorage
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('authToken', userData.token);
        if (userData.role) {
          localStorage.setItem('userRole', userData.role);
        }
        
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, error: response.message || 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {initialized && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;