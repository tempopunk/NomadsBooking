import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../features/authentication/context/AuthContext';
import logo from '../assets/LOGO.svg';
import theme from '../theme';

const AgentHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBrandClick = (e) => {
    e.preventDefault();
    const agentRole = localStorage.getItem('userRole');
    const dashboardMap = {
      'HotelAgent': '/agent/hotel-dashboard',
      'FlightAgent': '/agent/flight-dashboard',
      'TravelAgent': '/agent/travel-dashboard'
    };
    const dashboard = dashboardMap[agentRole];
    if (dashboard) {
      navigate(dashboard);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/agent/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="#" onClick={handleBrandClick}>
            <img
              src={logo}
              alt="Nomads Booking Logo"
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
            />
            <span className="brand-text">NomadsBooking</span>
          </a>
          
          <div className="d-flex align-items-center">
            <div className="nav-item dropdown">
              <a
                className="nav-link"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaBars size={20} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/agent/profile">Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AgentHeader;