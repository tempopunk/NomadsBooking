import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import theme from '../../../theme';
import HeaderWithLogin from '../../../components/HeaderWithLogin';
import Footer from '../../../components/Footer';
import api from '../../authentication/api/authApi';

function RegisterAgent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    agentType: '',
    phoneNumber: '',
    address: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value) {
          errors[name] = 'Name is required';
        } else if (value.length < 2 || value.length > 25) {
          errors[name] = 'Name must be between 2 and 25 characters';
        }
        break;
      case 'email':
        if (!value) {
          errors[name] = 'Email is required';
        } else if (value.length < 2 || value.length > 25) {
          errors[name] = 'Email must be between 2 and 25 characters';
        }
        break;
      case 'password':
      case 'confirmPassword':
        if (!value) {
          errors[name] = 'Password is required';
        } else if (value.length < 2 || value.length > 25) {
          errors[name] = 'Password must be between 2 and 25 characters';
        }
        break;
      case 'agentType':
        if (!value) {
          errors[name] = 'Agent type is required';
        } 
        break;
      case 'companyName':
        if (!value) {
          errors[name] = 'Company name is required';
        } else if (value.length < 2 || value.length > 10) {
          errors[name] = 'Company name must be between 2 and 10 characters';
        }
        break;
      case 'address':
        if (!value) {
          errors[name] = 'Address is required';
        } else if (value.length < 2 || value.length > 100) {
          errors[name] = 'Address must be between 2 and 10 characters';
        }
        break;
      case 'phoneNumber':
        if (!value) {
          errors[name] = 'Phone number is required';
        } else if (value.length < 2 || value.length > 10) {
          errors[name] = 'Phone number must be between 2 and 10 characters';
        }
        break;
      default:
        break;
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields
    let hasErrors = false;
    const allErrors = {};
    
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors[field]) {
        hasErrors = true;
        allErrors[field] = fieldErrors[field];
      }
    });

    if (formData.password !== formData.confirmPassword) {
      hasErrors = true;
      allErrors.confirmPassword = 'Passwords do not match';
    }

    if (hasErrors) {
      setValidationErrors(allErrors);
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        passwordHash: formData.password,
        agentType: formData.agentType,
        companyName: formData.companyName,
        address: formData.address,
        phoneNumber: formData.phoneNumber
      };

      const response = await api.registerAgent(registrationData);

      if (response) {
        setError(null);
        setSuccess('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/agent/login', { 
            state: { message: 'Registration successful! Please login to continue.' }
          });
        }, 4000);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: theme.spacing.md,
    border: `1px solid ${theme.inputs.borderColor}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.darkGrey,
    backgroundColor: theme.colors.white,
    outline: 'none',
    transition: 'border-color 0.3s ease',
    marginBottom: theme.spacing.xs
  };

  const errorStyle = {
    color: '#E74C3C',
    fontSize: theme.typography.fontSize.small,
    marginBottom: theme.spacing.md
  };

  const labelStyle = {
    display: 'block',
    color: theme.colors.darkGrey,
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#FFF3E0',
      fontFamily: theme.typography.fontFamily.body
    }}>
      <HeaderWithLogin />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
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
              marginBottom: theme.spacing.lg
            }}>
              Join Our Agent Network
            </h1>
          </div>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '600px',
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
          }}>Agent Registration</h2>

          <form onSubmit={handleSubmit}>
            {success && (
              <div style={{
                backgroundColor: '#D4EDDA',
                color: '#155724',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
                fontSize: theme.typography.fontSize.small,
                textAlign: 'center'
              }}>
                {success}
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
              <label htmlFor="name" style={labelStyle}>Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                style={inputStyle}
                disabled={loading}
              />
              {validationErrors.name && <div style={errorStyle}>{validationErrors.name}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label htmlFor="email" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                style={inputStyle}
                disabled={loading}
              />
              {validationErrors.email && <div style={errorStyle}>{validationErrors.email}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label htmlFor="agentType" style={labelStyle}>Agent Type:</label>
              <select
                id="agentType"
                name="agentType"
                value={formData.agentType}
                onChange={handleChange}
                required
                style={inputStyle}
                disabled={loading}
              >
                <option value="">Select agent type</option>
                <option value="HotelAgent">Hotel Agent</option>
                <option value="FlightAgent">Flight Agent</option>
                <option value="TravelAgent">Travel Agent</option>
              </select>
              {validationErrors.agentType && <div style={errorStyle}>{validationErrors.agentType}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label htmlFor="companyName" style={labelStyle}>Company Name:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Enter your company name"
                style={inputStyle}
                disabled={loading}
              />
              {validationErrors.companyName && <div style={errorStyle}>{validationErrors.companyName}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label htmlFor="phoneNumber" style={labelStyle}>Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                style={inputStyle}
                disabled={loading}
              />
              {validationErrors.phoneNumber && <div style={errorStyle}>{validationErrors.phoneNumber}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label htmlFor="address" style={labelStyle}>Business Address:</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your business address"
                style={{
                  ...inputStyle,
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                disabled={loading}
              />
              {validationErrors.address && <div style={errorStyle}>{validationErrors.address}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label htmlFor="password" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={inputStyle}
                disabled={loading}
              />
              {validationErrors.password && <div style={errorStyle}>{validationErrors.password}</div>}
            </div>

            <div style={{ marginBottom: theme.spacing.lg }}>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                style={inputStyle}
                disabled={loading}
              />
              {validationErrors.confirmPassword && <div style={errorStyle}>{validationErrors.confirmPassword}</div>}
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
              {loading ? 'Registering...' : 'Register as Agent'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <p style={{
              color: theme.colors.darkGrey,
              fontSize: theme.typography.fontSize.small,
              margin: 0
            }}>
              Already registered?{' '}
              <Link 
                to="/agent/login"
                style={{
                  color: '#F39C12',
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium
                }}
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterAgent;