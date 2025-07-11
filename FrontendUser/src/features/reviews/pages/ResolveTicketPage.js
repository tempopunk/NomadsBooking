import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import supportApi from '../api/supportApi';
import { useAuth } from '../../authentication/context/AuthContext';
 
function ResolveTicketPage() {
  const [ticket, setTicket] = useState(null);
  const {user} = useAuth();
  const [agentResponse, setAgentResponse] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
 
  const { ticketId } = useParams();
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);
 
  const fetchTicketDetails = async () => {
    try {
      const data = await supportApi.getTicketDetails(ticketId);
      setTicket(data);
    } catch (err) {
      setError('Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
 
    try {
      await supportApi.updateTicketByAgent(ticketId, status, agentResponse);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
 
  const getAgentDashboardPath = () => {
    if (!user) return '/agent/hotel-dashboard'; // fallback
   
    switch (user.role) {
      case 'HotelAgent':
        return '/agent/hotel-dashboard';
      case 'FlightAgent':
        return '/agent/flight-dashboard';
      case 'TravelAgent':
        return '/agent/travel-dashboard';
      default:
        return '/agent/hotel-dashboard';
    }
  };
 
  if (loading) {
    return (
      <>
        <MainHeader />
        <Container className="py-5 text-center">
          <Spinner animation="border" />
        </Container>
        <Footer />
      </>
    );
  }
 
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFF3E0'
    }}>
      <MainHeader />
      <Container className="py-5">
        <Card className="shadow-lg">
          <Card.Body className="p-4">
            {success ? (
              <div className="text-center">
                <h4 className="text-success mb-4" style={{ color: '#000000' }}>Ticket Updated Successfully!</h4>
                <Button
                  variant="primary"
                  onClick={() => navigate(getAgentDashboardPath())}
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <>
                <h3 className="mb-4" style={{ color: '#000000' }}>Resolve Support Ticket #{ticketId}</h3>
               
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
 
                <div className="mb-4">
                  <h5 style={{ color: '#000000' }}>Ticket Details</h5>
                  <p><strong>User ID:</strong> {ticket?.userId}</p>
                  <p><strong>Booking ID:</strong> {ticket?.bookingId}</p>
                  <p><strong>Issue:</strong> {ticket?.issue}</p>
                  <p><strong>Current Status:</strong> {ticket?.status}</p>
                  <p><strong>Created Date:</strong> {new Date(ticket?.createdDate).toLocaleString()}</p>
                </div>
 
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Update Status</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </Form.Select>
                  </Form.Group>
 
                  <Form.Group className="mb-4">
                    <Form.Label>Agent Response</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={agentResponse}
                      onChange={(e) => setAgentResponse(e.target.value)}
                      required
                      placeholder="Enter your response to the user's issue..."
                    />
                  </Form.Group>
 
                  <div className="d-flex gap-3">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : 'Update Ticket'}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate(getAgentDashboardPath())}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
 
export default ResolveTicketPage;