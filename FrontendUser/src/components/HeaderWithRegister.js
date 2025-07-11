import React from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import logo from '../assets/LOGO.svg';

function HeaderWithRegister() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/agent/register');
  };

  return (
    <header>
      <nav style={{
        backgroundColor: theme.colors.white,
        boxShadow: theme.shadows.md,
        padding: `${theme.spacing.md} 0`,
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <a className="text-decoration-none d-flex align-items-center" href="/" style={{ gap: theme.spacing.md }}>
              <img
                src={logo}
                alt="Nomads Booking Logo"
                style={{ width: '50px', height: '50px' }}
              />
              <span style={{
                fontSize: '1.3rem',
                fontFamily: theme.typography.fontFamily.heading,
                fontWeight: theme.typography.fontWeight.bold,
                letterSpacing: '0.5px'
              }}>
                <span style={{ color: '#F39C12' }}>Nomads</span><span style={{ color: '#1ABC9C' }}>Booking</span>
              </span>
            </a>
            <button
              onClick={handleRegisterClick}
              style={{
                backgroundColor: '#F39C12',
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
                fontSize: theme.typography.fontSize.body,
                fontFamily: theme.typography.fontFamily.body,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#E67E22'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#F39C12'}
            >
              Register
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderWithRegister;