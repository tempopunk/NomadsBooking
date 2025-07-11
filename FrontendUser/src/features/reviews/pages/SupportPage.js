import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import supportApi from '../api/supportApi';
 
function SupportPage() {
  const [issueText, setIssueText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const userId = localStorage.getItem('userId');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
 
    console.log('Form submitted with:', {
      bookingId,
      issueText,
      userId
    });

    try {
      const response = await supportApi.submitSupportTicket(bookingId, issueText, userId);
      console.log('Support ticket created:', response);
      setSuccessMsg('Your support ticket has been successfully created!');
      setIssueText('');
    } catch (error) {
      console.error('Support ticket submission error:', error);
      setErrorMsg('Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        <Card className="shadow-lg mx-auto border-0" style={{ maxWidth: '700px', borderRadius: '16px' }}>
          <Card.Body className="p-5">
            {!successMsg && (
              <>
                <Card.Title className="mb-4 text-center fs-3 fw-bold" style={{ color: '#000000' }}>
                  Contact Support
                </Card.Title>
                <Card.Text className="text-muted text-center mb-4">
                  Support for Booking ID: <strong>{bookingId}</strong>
                </Card.Text>
              </>
            )}
 
            {successMsg ? (
              <div className="text-center">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/3845/3845731.png"
                  alt="Support Submitted"
                  style={{ width: '120px', marginBottom: '20px' }}
                />
                <h4 className="text-success mb-3">{successMsg}</h4>
                <p className="mb-4 text-muted" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
                  Our team has received your request and will respond shortly.
                  <br />
                  <span style={{ fontWeight: '500', color: '#2C3E50' }}>
                    Thank you for trusting NomadsBooking.
                  </span>
                </p>
                <Button variant="outline-primary" onClick={() => navigate('/home')}>
                  Back to Home
                </Button>
              </div>
            ) : (
              <>
                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
 
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="issueText">
                    <Form.Label className="fw-semibold">Describe Your Issue</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={issueText}
                      onChange={(e) => setIssueText(e.target.value)}
                      required
                      placeholder="Write your message here..."
                    />
                  </Form.Group>
 
                  <div className="text-center">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Request'}
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
 
export default SupportPage;
