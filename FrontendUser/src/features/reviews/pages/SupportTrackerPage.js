import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import supportApi from '../api/supportApi';
 
function SupportTrackerPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
 
  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await supportApi.getMyTickets(userId);
        setTickets(data);
      } catch (error) {
        setErrorMsg('Failed to load support tickets.');
      } finally {
        setLoading(false);
      }
    }
 
    fetchTickets();
  }, [userId]);
 
  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        <h3 className="mb-4" style={{ color: '#000000' }}>My Support Tickets</h3>
 
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : errorMsg ? (
          <Alert variant="danger">{errorMsg}</Alert>
        ) : tickets.length === 0 ? (
          <p className="text-muted">No support tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.ticketId} className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title className="mb-2" style={{ color: '#000000' }}>Ticket #{ticket.ticketId}</Card.Title>
                <Card.Text>
                  <strong>Issue:</strong> {ticket.issue}<br />
                  <strong>Status:</strong>{' '}
                  <Badge bg={
                    ticket.status === 'OPEN' ? 'warning' :
                    ticket.status === 'RESOLVED' ? 'success' :
                    ticket.status === 'IN_PROGRESS' ? 'info' :
                    'secondary'
                  }>
                    {ticket.status}
                  </Badge>
                </Card.Text>
                <div className="text-end">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate(`/support/details/${ticket.ticketId}`)}
                  >
                    Track
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
      <Footer />
    </div>
  );
}
 
export default SupportTrackerPage;

