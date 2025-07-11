import React, { useState, useEffect } from 'react';
import AgentHeader from '../../../components/AgentHeader';
import Footer from '../../../components/Footer';
import theme from '../../../theme';

function AgentProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    address: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAgentProfile();
  }, []);

  const fetchAgentProfile = async () => {
    try {
      setLoading(true);
      const agentId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8087/api/v1/auth/agent/profile/${agentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      setFormData(profileData);
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchAgentProfile(); // Reset form to original values
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name || formData.name.length < 2 || formData.name.length > 25) {
      errors.name = 'Name must be between 2 and 25 characters';
    }
    if (!formData.email || formData.email.length < 2 || formData.email.length > 25) {
      errors.email = 'Email must be between 2 and 25 characters';
    }
    if (!formData.address || formData.address.length < 2 || formData.address.length > 100) {
      errors.address = 'Address must be between 2 and 100 characters';
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 2 || formData.phoneNumber.length > 10) {
      errors.phoneNumber = 'Phone number must be between 2 and 10 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // const validationErrors = validateForm();
    // if (Object.keys(validationErrors).length > 0) {
    //     setError(validationErrors);
    //   setError('Please correct the form errors');
    //   return;
    // }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const agentId = localStorage.getItem('userId');
      
      const updatedFormData = {
        ...formData,
        agentId: agentId
      };

      const response = await fetch('http://localhost:8087/api/v1/auth/agent/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFF3E0' // Light golden orange background
    }}>
      <AgentHeader />
      
      <main style={{
        flex: 1,
        padding: theme.spacing.xl,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          boxShadow: theme.shadows.lg
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
          }}>
            <h2 style={{
              color: '#000000',
              margin: 0
            }}>Agent Profile</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: 'pointer'
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div style={{
              backgroundColor: '#FDEDEC',
              color: '#E74C3C',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#D4EFDF',
              color: '#27AE60',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: theme.spacing.md }}>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing.xs,
                color: theme.colors.darkGrey
              }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.lightGrey}`,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: !isEditing ? '#f8f9fa' : 'white'
                }}
                disabled={!isEditing}
              />
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing.xs,
                color: theme.colors.darkGrey
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.lightGrey}`,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: !isEditing ? '#f8f9fa' : 'white'
                }}
                disabled={!isEditing}
              />
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing.xs,
                color: theme.colors.darkGrey
              }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.lightGrey}`,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: !isEditing ? '#f8f9fa' : 'white'
                }}
                disabled={!isEditing}
              />
            </div>

            <div style={{ marginBottom: theme.spacing.md }}>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing.xs,
                color: theme.colors.darkGrey
              }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.lightGrey}`,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: !isEditing ? '#f8f9fa' : 'white'
                }}
                disabled={!isEditing}
              />
            </div>

            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing.xs,
                color: theme.colors.darkGrey
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.lightGrey}`,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: !isEditing ? '#f8f9fa' : 'white'
                }}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div style={{
                display: 'flex',
                gap: theme.spacing.md,
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: theme.spacing.md,
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AgentProfile;