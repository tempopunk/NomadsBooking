import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie } from 'react-icons/fa';
import theme from '../theme';

function AuthButtons({ buttonType = 'login' }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (buttonType === 'register') {
      navigate('/register/user');
    } else {
      navigate('/');
    }
  };

  const handleAgentClick = () => {
    navigate('/agent/login');
  };

  return (
    <div style={{ display: 'flex', gap: theme.spacing.md }}>
      <button
        onClick={handleButtonClick}
        style={{
          backgroundColor: theme.buttons.primary.backgroundColor,
          color: theme.buttons.primary.color,
          border: 'none',
          borderRadius: theme.borderRadius.md,
          padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
          fontSize: theme.typography.fontSize.body,
          fontFamily: theme.typography.fontFamily.body,
          fontWeight: theme.typography.fontWeight.medium,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = theme.buttons.primary.hoverBg}
        onMouseOut={(e) => e.target.style.backgroundColor = theme.buttons.primary.backgroundColor}
      >
        {buttonType === 'register' ? 'Register' : 'Login'}
      </button>

      <button
        onClick={handleAgentClick}
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
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#D68A00'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#F39C12'}
      >
        <FaUserTie /> I'm an Agent
      </button>
    </div>
  );
}

export default AuthButtons;