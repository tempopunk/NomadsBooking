import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/authApi';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import theme from '../../../theme';

function RegisterUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check password match on every change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (confirmPassword) {
      setError(newPassword !== confirmPassword ? "Passwords do not match." : null);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password) {
      setError(password !== newConfirmPassword ? "Passwords do not match." : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Prepare data to match UserDto (passwordHash)
    const userData = {
      name,
      email,
      passwordHash: password,
    };

    try {
      const responseMessage = await api.registerUser(userData);
      setMessage(responseMessage || "User registered successfully!");
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
      <Header />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: `${theme.spacing.md} ${theme.spacing.md}`
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.lg
          }}>
            <div style={{
              width: '100%',
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.lg,
              fontFamily: theme.typography.fontFamily.body
            }}>
              <h2 style={{
                color: theme.colors.darkGrey,
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: theme.typography.fontSize.h2,
                fontWeight: theme.typography.fontWeight.semibold,
                marginBottom: theme.spacing.xl,
                textAlign: 'center'
              }}>Register</h2>

              <form onSubmit={handleSubmit} noValidate>
                {message && (
                  <div style={{
                    backgroundColor: '#D4EDDA',
                    color: '#155724',
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.lg,
                    fontSize: theme.typography.fontSize.small,
                    textAlign: 'center'
                  }}>
                    {message}
                  </div>
                )}

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
                  <label 
                    htmlFor="name" 
                    style={{
                      display: 'block',
                      color: theme.colors.darkGrey,
                      fontSize: theme.typography.fontSize.small,
                      fontWeight: theme.typography.fontWeight.medium,
                      marginBottom: theme.spacing.xs
                    }}
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.inputs.borderColor}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.darkGrey,
                      backgroundColor: theme.colors.white,
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputs.focusBorderColor}
                    onBlur={(e) => e.target.style.borderColor = theme.inputs.borderColor}
                    disabled={loading}
                  />
                </div>

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
                      border: `1px solid ${theme.inputs.borderColor}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.darkGrey,
                      backgroundColor: theme.colors.white,
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputs.focusBorderColor}
                    onBlur={(e) => e.target.style.borderColor = theme.inputs.borderColor}
                    disabled={loading}
                  />
                </div>

                <div style={{ marginBottom: theme.spacing.md }}>
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
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.inputs.borderColor}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.darkGrey,
                      backgroundColor: theme.colors.white,
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputs.focusBorderColor}
                    onBlur={(e) => e.target.style.borderColor = theme.inputs.borderColor}
                    disabled={loading}
                  />
                </div>

                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label 
                    htmlFor="confirmPassword"
                    style={{
                      display: 'block',
                      color: theme.colors.darkGrey,
                      fontSize: theme.typography.fontSize.small,
                      fontWeight: theme.typography.fontWeight.medium,
                      marginBottom: theme.spacing.xs
                    }}
                  >
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    placeholder="Confirm your password"
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.inputs.borderColor}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.body,
                      color: theme.colors.darkGrey,
                      backgroundColor: theme.colors.white,
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputs.focusBorderColor}
                    onBlur={(e) => e.target.style.borderColor = theme.inputs.borderColor}
                    disabled={loading}
                  />
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
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = theme.buttons.primary.hoverBg}
                  onMouseOut={(e) => e.target.style.backgroundColor = theme.buttons.primary.backgroundColor}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
                <p style={{
                  color: theme.colors.darkGrey,
                  fontSize: theme.typography.fontSize.small,
                  margin: 0
                }}>
                  Already have an account? Use the Login button above.
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

export default RegisterUser;