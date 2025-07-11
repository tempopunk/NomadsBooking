import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import paymentApi from '../api/paymentApi';

function UpiPaymentForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentResponse } = location.state || {};

    const [upiId, setUpiId] = useState('');
    const [validationError, setValidationError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (!paymentResponse) {
            navigate('/payment/select', { replace: true });
        }
    }, [paymentResponse, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        if (!paymentResponse) return;

        if (!upiId) {
            setValidationError('UPI ID is required.');
            return;
        }
        if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
            setValidationError('Invalid UPI ID format.');
            return;
        }

        setLocalLoading(true);

        try {
            await paymentApi.finalizeUpiPayment(
                paymentResponse.paymentId,
                { upiId }
            );
            navigate('/payment/success', { 
                state: { paymentResponse } 
            });
        } catch (error) {
            setValidationError('Payment failed. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
            <MainHeader />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Card className="p-4 shadow-lg">
                            <Card.Body>
                                <h2 className="text-center mb-4">Pay with UPI</h2>
                                {paymentResponse && (
                                    <p className="text-center mb-4 lead">
                                        Amount: <strong>₹{paymentResponse.amount?.toFixed(2)}</strong>
                                    </p>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>UPI ID:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            required
                                            placeholder="username@upi"
                                        />
                                        <Form.Text className="text-muted">
                                            Enter your UPI ID in the format: username@upi
                                        </Form.Text>
                                    </Form.Group>
                                    {validationError && (
                                        <Alert variant="danger" className="mb-3">
                                            {validationError}
                                        </Alert>
                                    )}
                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={localLoading}
                                        >
                                            {localLoading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Pay Now'
                                            )}
                                        </Button>
                                        <Button 
                                            variant="secondary"
                                            onClick={() => navigate('/payment/select', { 
                                                state: { paymentResponse } 
                                            })}
                                        >
                                            Back to Payment Methods
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UpiPaymentForm;