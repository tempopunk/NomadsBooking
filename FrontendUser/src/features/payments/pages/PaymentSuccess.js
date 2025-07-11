import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentResponse } = location.state || {};

    if (!paymentResponse) {
        navigate('/home', { replace: true });
        return null;
    }

    return (
        <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
            <MainHeader />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Card className="p-4 shadow-lg text-center">
                            <Card.Body>
                                <div className="mb-4" style={{ fontSize: '4rem' }}>
                                    ✅
                                </div>
                                <h2 className="mb-4">Payment Successful!</h2>
                                <div className="mb-4">
                                    <p className="lead mb-2">Amount Paid: <strong>₹{paymentResponse.amount?.toFixed(2)}</strong></p>
                                    <p className="text-muted">Payment ID: {paymentResponse.paymentId}</p>
                                    <p className="text-muted">Booking ID: {paymentResponse.bookingId}</p>
                                </div>
                                <p className="text-success mb-4">
                                    Your booking has been confirmed and you will receive a confirmation email shortly.
                                </p>
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="primary"
                                        onClick={() => navigate('/home')}
                                    >
                                        Return to Home
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentSuccess;