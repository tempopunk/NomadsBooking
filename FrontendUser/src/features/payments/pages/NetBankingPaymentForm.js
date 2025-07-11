import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import paymentApi from '../api/paymentApi';

function NetBankingPaymentForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentResponse } = location.state || {};

    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: ''
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
        setBankDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        if (!paymentResponse) return;

        const { bankName, accountNumber, ifscCode } = bankDetails;
        
        // Validation
        if (!bankName || !accountNumber || !ifscCode) {
            setValidationError('All bank details are required.');
            return;
        }
        if (!/^\d+$/.test(accountNumber)) {
            setValidationError('Account number must contain only digits.');
            return;
        }
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
            setValidationError('Invalid IFSC code format.');
            return;
        }

        setLocalLoading(true);

        try {
            await paymentApi.finalizeNetBankingPayment(
                paymentResponse.paymentId,
                bankDetails
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
                                <h2 className="text-center mb-4">Pay with Net Banking</h2>
                                {paymentResponse && (
                                    <p className="text-center mb-4 lead">
                                        Amount: <strong>₹{paymentResponse.amount?.toFixed(2)}</strong>
                                    </p>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bank Name:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="bankName" 
                                            value={bankDetails.bankName} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Enter your bank name" 
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Account Number:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="accountNumber" 
                                            value={bankDetails.accountNumber} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Enter your account number" 
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>IFSC Code:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="ifscCode" 
                                            value={bankDetails.ifscCode} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="ABCD0123456"
                                            maxLength="11"
                                        />
                                        <Form.Text className="text-muted">
                                            Enter 11-character IFSC code (e.g., HDFC0001234)
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

export default NetBankingPaymentForm;