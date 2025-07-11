import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import paymentApi from '../api/paymentApi';

function CardPaymentForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentResponse } = location.state || {};

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });
    const [validationError, setValidationError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (!paymentResponse) {
            navigate('/payment/select', { replace: true });
        }
    }, [paymentResponse, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        if (!paymentResponse) return;

        const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv } = cardDetails;
        
        // Validation
        if (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv) {
            setValidationError('All card details are required.');
            return;
        }
        if (!/^\d+$/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19) {
            setValidationError('Invalid card number (13-19 digits only).');
            return;
        }
        if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth)) {
            setValidationError('Invalid expiry month (01-12).');
            return;
        }
        if (!/^\d{2}$/.test(expiryYear)) {
            setValidationError('Invalid expiry year (YY format).');
            return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            setValidationError('Invalid CVV (3 or 4 digits).');
            return;
        }

        setLocalLoading(true);

        try {
            await paymentApi.finalizeCardPayment(
                paymentResponse.paymentId,
                cardDetails
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
                                <h2 className="text-center mb-4">Pay with Card</h2>
                                {paymentResponse && (
                                    <p className="text-center mb-4 lead">
                                        Amount: <strong>₹{paymentResponse.amount?.toFixed(2)}</strong>
                                    </p>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Card Number:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="cardNumber" 
                                            value={cardDetails.cardNumber} 
                                            onChange={handleChange} 
                                            maxLength="19" 
                                            required 
                                            placeholder="1234 5678 9012 3456" 
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Card Holder Name:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="cardHolderName" 
                                            value={cardDetails.cardHolderName} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Name as on card" 
                                        />
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col xs={4}>
                                            <Form.Group>
                                                <Form.Label>Month</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="expiryMonth" 
                                                    value={cardDetails.expiryMonth} 
                                                    onChange={handleChange} 
                                                    placeholder="MM" 
                                                    maxLength="2" 
                                                    required 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={4}>
                                            <Form.Group>
                                                <Form.Label>Year</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="expiryYear" 
                                                    value={cardDetails.expiryYear} 
                                                    onChange={handleChange} 
                                                    placeholder="YY" 
                                                    maxLength="2" 
                                                    required 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={4}>
                                            <Form.Group>
                                                <Form.Label>CVV</Form.Label>
                                                <Form.Control 
                                                    type="password" 
                                                    name="cvv" 
                                                    value={cardDetails.cvv} 
                                                    onChange={handleChange} 
                                                    placeholder="123" 
                                                    maxLength="4" 
                                                    required 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
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

export default CardPaymentForm;