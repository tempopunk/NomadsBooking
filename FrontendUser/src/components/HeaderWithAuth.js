import React from 'react';
import theme from '../theme';
import logo from '../assets/LOGO.svg';
import AuthButtons from './AuthButtons';

function HeaderWithAuth({ buttonType = 'login' }) {
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
            <AuthButtons buttonType={buttonType} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderWithAuth;