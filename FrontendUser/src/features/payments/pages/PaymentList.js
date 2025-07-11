import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import paymentApi from '../api/paymentApi';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingInvoice, setProcessingInvoice] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const paymentData = await paymentApi.getMyPayments(userId);
        setPayments(paymentData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payments. Please try again.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleDownloadInvoice = async (paymentId) => {
    setProcessingInvoice(true);
    setSelectedPayment(paymentId);
    
    try {
      // First generate the invoice
      const invoiceResponse = await paymentApi.generateInvoice(paymentId);
      
      // Then download it using the invoice number from the response
      await paymentApi.downloadInvoice(invoiceResponse.invoiceNumber);
    } catch (error) {
      setError('Failed to download invoice. Please try again.');
    } finally {
      setProcessingInvoice(false);
      setSelectedPayment(null);
    }
  };

  if (loading) {
    return (
      <>
        <MainHeader />
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        <h2 className="mb-4" style={{ color: '#000000' }}>My Payments</h2>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {payments.length === 0 ? (
          <div className="text-center py-4">
            <p>No payments found.</p>
          </div>
        ) : (
          <Row>
            {payments.map((payment) => (
              <Col xs={12} className="mb-3" key={payment.paymentId}>
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h5 className="mb-3">Transaction ID: {payment.transactionId}</h5>
                        <div className="d-flex flex-column gap-2">
                          <p className="mb-1">
                            <strong>Payment Method:</strong> {payment.paymentMethod}
                          </p>
                          <p className="mb-1">
                            <strong>Status:</strong>{' '}
                            <span className={`badge ${
                              payment.paymentStatus === 'SUCCESS' 
                                ? 'bg-success' 
                                : payment.paymentStatus === 'PENDING' 
                                ? 'bg-warning' 
                                : 'bg-danger'
                            }`}>
                              {payment.paymentStatus}
                            </span>
                          </p>
                          <p className="mb-1">
                            <strong>Date:</strong> {formatDate(payment.paymentTimestamp)}
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="d-flex flex-column align-items-md-end h-100">
                          <h4 style={{ color: '#1ABC9C' }} className="mb-auto">
                            ₹{payment.amount}
                          </h4>
                          {payment.paymentStatus === 'SUCCESS' && (
                            <Button
                              style={{ 
                                backgroundColor: '#1ABC9C', 
                                borderColor: '#1ABC9C',
                                marginTop: '1rem'
                              }}
                              onClick={() => handleDownloadInvoice(payment.paymentId)}
                              disabled={processingInvoice && selectedPayment === payment.paymentId}
                            >
                              {processingInvoice && selectedPayment === payment.paymentId ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Processing...
                                </>
                              ) : (
                                'Download Invoice'
                              )}
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default PaymentList;