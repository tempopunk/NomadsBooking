import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import theme from '../../../theme';
import api from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    setProfile({
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = localStorage.getItem('userId');
      const updatedProfile = await api.updateUserProfile(userId, profile);
      
      // Update localStorage
      localStorage.setItem('userName', updatedProfile.name);
      localStorage.setItem('userEmail', updatedProfile.email);
      
      // Update the profile state
      setProfile(updatedProfile);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MainHeader />
      <Container className="py-5 flex-grow-1">
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0" style={{ color: '#000000' }}>My Profile</h2>
              {!isEditing && (
                <Button variant="primary" onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </Form.Group>

              {isEditing && (
                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}

export default Profile;