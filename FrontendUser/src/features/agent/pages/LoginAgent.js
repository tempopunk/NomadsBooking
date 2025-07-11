import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../authentication/context/AuthContext';
import theme from '../../../theme';
import HeaderWithRegister from '../../../components/HeaderWithRegister';
import Footer from '../../../components/Footer';
import api from '../../authentication/api/authApi';

function LoginAgent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    setLoading(true);

    try {
      const { success, error: loginError, user } = await login(api.loginAgent, email, password);
      
      if (success && user) {
        const dashboardMap = {
          'HotelAgent': '/agent/hotel-dashboard',
          'FlightAgent': '/agent/flight-dashboard',
          'TravelAgent': '/agent/travel-dashboard'
        };
        const dashboard = dashboardMap[user.role];
        if (dashboard) {
          navigate(dashboard);
        } else {
          throw new Error('Invalid agent role');
        }
      } else {
        try {
          // Try to parse the error as JSON to handle validation errors
          const errorObj = JSON.parse(loginError);
          if (typeof errorObj === 'object') {
            setValidationErrors(errorObj);
          } else {
            setError(loginError || 'An error occurred during login. Please try again.');
          }
        } catch (e) {
          // If error is not JSON, display it as a general error
          setError(loginError || 'An error occurred during login. Please try again.');
        }
      }
    } catch (err) {
      try {
        // Try to parse the error message as JSON
        const errorObj = JSON.parse(err.message);
        if (typeof errorObj === 'object') {
          setValidationErrors(errorObj);
        } else {
          setError(err.message || 'An error occurred. Please try again.');
        }
      } catch (e) {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#FFF3E0',
      fontFamily: theme.typography.fontFamily.body
    }}>
      <HeaderWithRegister />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Welcome Message Section */}
        <div style={{
          width: '100%',
          backgroundColor: '#FFF3E0',
          padding: `${theme.spacing.lg} 0`,
          marginBottom: theme.spacing.sm
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: `0 ${theme.spacing.xl}`,
            textAlign: 'center'
          }}>
            <h1 style={{
              color: '#000000',
              fontSize: theme.typography.fontSize.h1,
              fontFamily: theme.typography.fontFamily.heading,
              fontWeight: theme.typography.fontWeight.bold,
              marginBottom: theme.spacing.lg,
              position: 'relative',
              display: 'inline-block'
            }}>
              Agent Portal - <span style={{ color: '#F39C12' }}>Nomads</span><span style={{ color: '#F39C12' }}>Booking</span>
            </h1>
          </div>
        </div>

        {/* Login Form Section */}
        <div style={{
          width: '100%',
          backgroundColor: '#FFF3E0',
          padding: `${theme.spacing.md} ${theme.spacing.md}`,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing.xl
            }}>
              <h2 style={{
                color: theme.colors.darkGrey,
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: theme.typography.fontSize.h2,
                fontWeight: theme.typography.fontWeight.semibold,
                marginBottom: theme.spacing.xl,
                textAlign: 'center'
              }}>Agent Login</h2>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    backgroundColor: '#FDEDEC',
                    color: '#E74C3C',
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.lg,
                    fontSize: theme.typography.fontSize.small,
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: theme.spacing.md }}>
                  <label htmlFor="email" style={{
                    display: 'block',
                    color: theme.colors.darkGrey,
                    fontSize: theme.typography.fontSize.small,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.spacing.xs
                  }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your agent email"
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      border: `1px solid ${validationErrors.email ? '#E74C3C' : theme.inputs.borderColor}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.darkGrey,
                      backgroundColor: theme.colors.white,
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputs.focusBorderColor}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.email ? '#E74C3C' : theme.inputs.borderColor}
                    disabled={loading}
                  />
                  {validationErrors.email && (
                    <div style={{
                      color: '#E74C3C',
                      fontSize: theme.typography.fontSize.small,
                      marginTop: theme.spacing.xs
                    }}>
                      {validationErrors.email}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label htmlFor="password" style={{
                    display: 'block',
                    color: theme.colors.darkGrey,
                    fontSize: theme.typography.fontSize.small,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.spacing.xs
                  }}>
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      border: `1px solid ${validationErrors.password ? '#E74C3C' : theme.inputs.borderColor}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.darkGrey,
                      backgroundColor: theme.colors.white,
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputs.focusBorderColor}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.password ? '#E74C3C' : theme.inputs.borderColor}
                    disabled={loading}
                  />
                  {validationErrors.password && (
                    <div style={{
                      color: '#E74C3C',
                      fontSize: theme.typography.fontSize.small,
                      marginTop: theme.spacing.xs
                    }}>
                      {validationErrors.password}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: '#F39C12',
                    color: 'white',
                    padding: theme.spacing.md,
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'background-color 0.3s ease',
                    marginBottom: theme.spacing.md
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#E67E22'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#F39C12'}
                >
                  {loading ? 'Logging in...' : 'Login as Agent'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
                <p style={{
                  color: theme.colors.darkGrey,
                  fontSize: theme.typography.fontSize.small,
                  margin: 0
                }}>
                  Not registered yet?{' '}
                  <Link 
                    to="/agent/register"
                    style={{
                      color: '#F39C12',
                      textDecoration: 'none',
                      fontWeight: theme.typography.fontWeight.medium
                    }}
                  >
                    Register as Agent
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginAgent;