import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import hotelApi from '../api/hotelApi';

function ViewRoom() {
  const [room, setRoom] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // Fetch room details
        const roomData = await hotelApi.getRoomById(roomId);
        
        setRoom(roomData);

        // Fetch room images
        const images = await hotelApi.getRoomImages(roomId);
        setRoomImages(images);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch room details. Please try again.');
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setCheckoutError(null);
    
    try {
      const userId = localStorage.getItem('userId');
      const hotelId = sessionStorage.getItem('currentHotelId');
      
      if (!hotelId) {
        throw new Error('Hotel information is missing. Please try again.');
      }
      
      const paymentResponse = await hotelApi.checkout(userId, hotelId, room.roomId);
      
      // Navigate to payment selection with the payment response
      navigate('/payment/select', { 
        state: { paymentResponse } 
      });
    } catch (error) {
      setCheckoutError(error.message || 'Failed to process checkout. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div>
        <MainHeader />
        <Container className="py-5">
          <div className="text-center">Loading room details...</div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <MainHeader />
        <Container className="py-5">
          <div className="text-center text-danger">{error}</div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        {/* Room Name */}
        <h1 className="display-4 mb-4 text-center" style={{ color: '#000000' }}>{room?.roomName}</h1>

        {/* Image Carousel */}
        <div className="mb-5">
          <Carousel interval={null} className="room-carousel">
            {roomImages.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={`data:${image.contentType};base64,${image.imageData}`}
                  alt={`Room view ${index + 1}`}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Room Details */}
        <Card className="mb-5">
          <Card.Body>
            <h2 className="mb-4" style={{ color: '#000000' }}>Room Details</h2>
            <Row>
              <Col md={6}>
                <div className="p-3 bg-light rounded">
                  <h3 className="h5 mb-4" style={{ color: '#000000' }}>Basic Information</h3>
                  <div className="d-flex flex-column gap-3">
                    <p className="mb-2 d-flex align-items-center">
                      <span title="Room Type" className="me-3">🏠</span>
                      <strong>Room Type:</strong>
                      <span className="ms-2">{room?.roomType}</span>
                    </p>
                    <p className="mb-2 d-flex align-items-center">
                      <span title="Max Occupancy" className="me-3">👥</span>
                      <strong>Max Occupancy:</strong>
                      <span className="ms-2">{room?.maxOccupancy} persons</span>
                    </p>
                    <p className="mb-2 d-flex align-items-center">
                      <span title="Food Option" className="me-3">🍽️</span>
                      <strong>Food Option:</strong>
                      <span className="ms-2">{room?.foodOption}</span>
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 bg-light rounded h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="h5 mb-4" style={{ color: '#000000' }}>Pricing</h3>
                    <p className="mb-4 d-flex align-items-center">
                      <span title="Price per Night" className="me-3">💰</span>
                      <strong>Price per Night:</strong>
                      <span className="ms-2 fs-3" style={{ color: '#1ABC9C' }}>₹{room?.pricePerNight}</span>
                    </p>
                  </div>
                  <div>
                    <h3 className="h5 mb-3" style={{ color: '#000000' }}>Amenities</h3>
                    <div className="d-flex flex-wrap gap-2">
                      {room?.ammenities.map((amenity, index) => (
                        <span 
                          key={index}
                          className="badge bg-white text-dark border"
                          style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                        >
                          ✨ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Checkout Button */}
            <div className="mt-4 text-center">
              {checkoutError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {checkoutError}
                </div>
              )}
              <button 
                className="btn btn-primary btn-lg px-5"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}

export default ViewRoom;