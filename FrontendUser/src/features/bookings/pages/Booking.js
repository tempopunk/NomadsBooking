import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import bookingApi from '../api/bookingApi';

function Booking() {
    const [activeTab, setActiveTab] = useState('paid');
    const [paidBookings, setPaidBookings] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const [paidData, pendingData] = await Promise.all([
                bookingApi.getPaidBookings(userId),
                bookingApi.getPendingBookings(userId)
            ]);
            console.log('Paid Bookings:', paidData);
            console.log('Pending Bookings:', pendingData);

            setPaidBookings(paidData || []);
            setPendingBookings(pendingData || []);
            setLoading(false);
        } catch (error) {
            // Only set error for non-404 errors
            if (error.message !== '404') {
                setError('Failed to fetch bookings. Please try again.');
            } else {
                setPaidBookings([]);
                setPendingBookings([]);
            }
            setLoading(false);
        }
    };

    const handleRaiseSupport = (bookingId) => {
        navigate(`/support/${bookingId}`);
    };

    const renderBookingCard = (booking, isPaid = false) => {
        const renderBookingDetails = () => {
            switch(booking.bookingType) {
                case 'HOTEL':
                    return (
                        <>
                            <strong>Booking Type:</strong> {booking.bookingType}<br />
                            <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}<br />
                            <strong>Hotel:</strong> {booking.hotel?.hotelName}<br />
                            <strong>Room:</strong> {booking.room?.roomName}<br />
                            <strong>Amount:</strong> <span style={{ color: '#1ABC9C' }}>₹{booking.totalAmount}</span>
                        </>
                    );
                case 'FLIGHT':
                    return (
                        <>
                            <strong>Booking Type:</strong> {booking.bookingType}<br />
                            <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}<br />
                            <strong>Flight:</strong> {booking.flight?.companyName}<br />
                            <strong>From:</strong> {booking.flight?.origin}<br />
                            <strong>To:</strong> {booking.flight?.destination}<br />
                            <strong>Amount:</strong> <span style={{ color: '#1ABC9C' }}>₹{booking.totalAmount}</span>
                        </>
                    );
                case 'PACKAGE':
                    return (
                        <>
                            <strong>Booking Type:</strong> {booking.bookingType}<br />
                            <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}<br />
                            <strong>Amount:</strong> <span style={{ color: '#1ABC9C' }}>₹{booking.totalAmount}</span>
                        </>
                    );
                default:
                    return null;
            }
        };

        return (
            <Card key={booking.bookingId} className="mb-3">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title style={{ color: '#000000' }}>
                                {booking.bookingType === 'HOTEL' && booking.hotel?.hotelName}
                                {booking.bookingType === 'FLIGHT' && `Flight Booking - ${booking.flight?.companyName}`}
                                {booking.bookingType === 'PACKAGE' && 'Package Booking'}
                            </Card.Title>
                            <Card.Text>
                                {renderBookingDetails()}
                            </Card.Text>
                            <div className="mt-2">
                                <span className={`badge ${booking.status === 'PAID' ? 'bg-success' : 'bg-warning'}`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                        {isPaid && (
                            <div className="d-flex align-items-center">
                                <Button 
                                    style={{ 
                                        backgroundColor: '#1ABC9C',
                                        borderColor: '#1ABC9C'
                                    }}
                                    onClick={() => handleRaiseSupport(booking.bookingId)}
                                >
                                    Raise Support
                                </Button>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        );
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
                <h2 className="mb-4" style={{ color: '#000000' }}>My Bookings</h2>
                
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="tabs" className="mb-4">
                        <Nav.Item>
                            <Nav.Link eventKey="paid" style={{ color: '#000000' }}>Paid Bookings</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="pending" style={{ color: '#000000' }}>Pending Bookings</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="paid">
                            {paidBookings.length === 0 ? (
                                <p className="text-center py-4">No paid bookings found.</p>
                            ) : (
                                paidBookings.map(booking => renderBookingCard(booking, true))
                            )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="pending">
                            {pendingBookings.length === 0 ? (
                                <p className="text-center py-4">No pending bookings found.</p>
                            ) : (
                                pendingBookings.map(booking => renderBookingCard(booking))
                            )}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>
            <Footer />
        </div>
    );
}

export default Booking;