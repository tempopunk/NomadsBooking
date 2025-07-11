import React, { useState, useEffect } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';

function PaymentMethodSelection() {
    const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPaymentResponse = location.state?.paymentResponse;

    useEffect(() => {
        if (!currentPaymentResponse) {
            setError('Payment context missing. Redirecting to home.');
            navigate('/home', { replace: true });
        }
    }, [currentPaymentResponse, navigate]);

    const handleSelectMethod = (methodRoute) => {
        navigate(methodRoute, { 
            state: { paymentResponse: currentPaymentResponse } 
        });
    };

    if (!currentPaymentResponse) {
        return (
            <>
                <MainHeader />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
                    <Spinner animation="border" role="status" className="mb-3" />
                    <p className="text-body ms-3">Loading payment details...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
            <MainHeader />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <Card className="p-4 shadow-lg">
                            <Card.Body>
                                <h2 className="mb-4 text-center">Select Payment Method</h2>
                                <p className="lead text-center mb-4">
                                    Amount: <strong>₹{currentPaymentResponse.amount?.toFixed(2) || 'N/A'}</strong>
                                </p>

                                <div className="d-grid gap-3">
                                    <Button 
                                        variant="info" 
                                        size="lg" 
                                        onClick={() => handleSelectMethod('/payment/card')} 
                                        disabled={isLoadingGlobal}
                                        style={{ backgroundColor: '#20c997', borderColor: '#20c997', color: 'white' }}
                                        className="d-flex align-items-center justify-content-center gap-2"
                                    >
                                        💳 Credit / Debit Card
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        size="lg" 
                                        onClick={() => handleSelectMethod('/payment/upi')} 
                                        disabled={isLoadingGlobal}
                                        className="d-flex align-items-center justify-content-center gap-2"
                                    >
                                        📱 UPI
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        size="lg" 
                                        onClick={() => handleSelectMethod('/payment/netbanking')} 
                                        disabled={isLoadingGlobal}
                                        className="d-flex align-items-center justify-content-center gap-2"
                                    >
                                        🏦 Net Banking
                                    </Button>
                                </div>

                                {isLoadingGlobal && (
                                    <div className="mt-3 text-center">
                                        <Spinner animation="border" size="sm" /> Processing...
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {error}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentMethodSelection;