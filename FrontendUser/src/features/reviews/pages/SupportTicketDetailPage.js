import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import supportApi from '../api/supportApi';
 
function SupportTicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
 
  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await supportApi.getTicketDetails(ticketId);
        setTicket(data);
      } catch (error) {
        setErrorMsg('Unable to fetch ticket details');
      } finally {
        setLoading(false);
      }
    }
 
    fetchDetails();
  }, [ticketId]);
 
  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        <h3 className="mb-4" style={{ color: '#000000' }}>Ticket Details</h3>
 
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : errorMsg ? (
          <Alert variant="danger">{errorMsg}</Alert>
        ) : (
          <Card className="shadow">
            <Card.Body>
              <Card.Title style={{ color: '#000000' }}>Ticket #{ticket.ticketId}</Card.Title>
              <Card.Text>
                <strong>Issue:</strong> {ticket.issue}<br />
                <strong>Status:</strong> {ticket.status}<br />
                <strong>Agent Response:</strong><br />
                <div className="border p-3 rounded bg-light">
                  {ticket.agentResponse ? ticket.agentResponse : (
                    <span className="fst-italic text-muted">Awaiting response...</span>
                  )}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </Container>
      <Footer />
    </div>
  );
}
 
export default SupportTicketDetailPage;

