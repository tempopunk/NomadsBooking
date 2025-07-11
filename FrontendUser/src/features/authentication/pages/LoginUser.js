import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/authApi';
import theme from '../../../theme';
import HeaderWithAuth from '../../../components/HeaderWithAuth';
import Footer from '../../../components/Footer';

function LoginUser() {
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
      const { success, error: loginError, user } = await login(api.loginUser, email, password);
      
      if (success && user) {
        navigate('/home');
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
      backgroundColor: '#FDEFE1',
      fontFamily: theme.typography.fontFamily.body
    }}>
      <HeaderWithAuth buttonType="register" />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Login Form Section */}
        <div style={{
          width: '100%',
          backgroundColor: '#FDEFE1',
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
              }}>Login</h2>

              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div style={{
                    backgroundColor: '#FDEDEC',
                    color: '#E74C3C',
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.lg,
                    fontSize: theme.typography.fontSize.small,
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out'
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: theme.spacing.md }}>
                  <label 
                    htmlFor="email" 
                    style={{
                      display: 'block',
                      color: theme.colors.darkGrey,
                      fontSize: theme.typography.fontSize.small,
                      fontWeight: theme.typography.fontWeight.medium,
                      marginBottom: theme.spacing.xs
                    }}
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
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
                  <label 
                    htmlFor="password"
                    style={{
                      display: 'block',
                      color: theme.colors.darkGrey,
                      fontSize: theme.typography.fontSize.small,
                      fontWeight: theme.typography.fontWeight.medium,
                      marginBottom: theme.spacing.xs
                    }}
                  >
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
                    backgroundColor: theme.buttons.primary.backgroundColor,
                    color: theme.buttons.primary.color,
                    padding: theme.spacing.md,
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = theme.buttons.primary.hoverBg}
                  onMouseOut={(e) => e.target.style.backgroundColor = theme.buttons.primary.backgroundColor}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
                <p style={{
                  color: theme.colors.darkGrey,
                  fontSize: theme.typography.fontSize.small,
                  margin: 0
                }}>
                  New to NomadasBooking? Click Register above to create an account!
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

export default LoginUser;