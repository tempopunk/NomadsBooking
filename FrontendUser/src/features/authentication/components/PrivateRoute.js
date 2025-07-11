import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isAgentRoute = location.pathname.startsWith('/agent/');

  // Check for agent routes
  if (isAgentRoute) {
    if (!isAuthenticated) {
      return <Navigate to="/agent/login" replace />;
    }

    const agentRole = user?.role;
    if (!agentRole) {
      return <Navigate to="/agent/login" replace />;
    }

    // Extract the target dashboard from the path
    const targetDashboard = location.pathname.split('/')[2];

    // Map agent roles to their dashboards
    const agentDashboards = {
      'HotelAgent': 'hotel-dashboard',
      'FlightAgent': 'flight-dashboard',
      'TravelAgent': 'travel-dashboard'
    };

    const correctDashboard = agentDashboards[agentRole];

    // If we're not already on the correct dashboard and we know which one it should be,
    // redirect to the correct one
    if (correctDashboard && targetDashboard !== correctDashboard) {
      return <Navigate to={`/agent/${correctDashboard}`} replace />;
    }
  } else {
    // For non-agent routes, just check if authenticated
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;