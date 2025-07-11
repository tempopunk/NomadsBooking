import React, { useState, useEffect } from 'react';
import { Container, Tab, Nav, Row, Col, Card, Carousel, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMoneyBillWave, FaPlane, FaBed, FaHotel, FaStar, FaUser } from 'react-icons/fa';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import SubmitReviews from '../../../components/SubmitReviews';
import hotelApi from '../../hotelandflightbooking/api/hotelApi';
import packageApi from '../api/packageApi';
import reviewApi from '../../reviews/api/reviewApi';

function ViewPackage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hotel');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [hotelImages, setHotelImages] = useState([]);
  const [room, setRoom] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [packageReviews, setPackageReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        
        // Get package details including hotelId, roomId, flightId
        const packageDetails = await packageApi.getPackageDetails(packageId);
        setPackageDetails(packageDetails);
        
        // Fetch hotel details and images
        const hotelData = await hotelApi.getHotelById(packageDetails.hotelId);
        const hotelImagesData = await hotelApi.getHotelImages(packageDetails.hotelId);
        setHotel(hotelData);
        setHotelImages(hotelImagesData);

        // Fetch room details and images
        const roomData = await hotelApi.getRoomById(packageDetails.roomId);
        const roomImagesData = await hotelApi.getRoomImages(packageDetails.roomId);
        setRoom(roomData);
        setRoomImages(roomImagesData);

        // Fetch flight details
        if (packageDetails.departureFlightId) {
          const departureFlightData = await packageApi.viewFlight(packageDetails.departureFlightId);
          setDepartureFlight(departureFlightData);
        }
        
        if (packageDetails.returnFlightId) {
          const returnFlightData = await packageApi.viewFlight(packageDetails.returnFlightId);
          setReturnFlight(returnFlightData);
        }

        // Check for existing review
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const reviewData = await reviewApi.alreadyReviewedPackage(parseInt(userId), parseInt(packageId));
            setExistingReview(reviewData);
          } catch (err) {
            console.error('Error fetching review:', err);
          }
        }

        // Fetch package reviews
        try {
          const reviews = await reviewApi.getReviewsByPackage(packageId);
          setPackageReviews(reviews);
        } catch (err) {
          console.error('Error fetching package reviews:', err);
        }

        // Get average rating for the package
        try {
          const rating = await hotelApi.getAveragePackageRating(packageId);
          setAverageRating(rating);
        } catch (err) {
          console.error('Error fetching average rating:', err);
        }

        setReviewsLoading(false);
        setLoading(false);
      } catch (err) {
        setError('Failed to load package details. Please try again later.');
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  const handleBookNow = async () => {
    setIsProcessing(true);
    setCheckoutError(null);
    
    try {
      const userId = localStorage.getItem('userId');
      
      const paymentResponse = await packageApi.checkout(userId, packageId);
      
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

  const handleReviewSubmitted = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const [reviewData, packageReviews] = await Promise.all([
        reviewApi.alreadyReviewedPackage(parseInt(userId), parseInt(packageId)),
        reviewApi.getReviewsByPackage(packageId)
      ]);
      setExistingReview(reviewData);
      setPackageReviews(packageReviews);
    } catch (err) {
      console.error('Error updating review status:', err);
    }
  };

  const renderReviewStars = (rating) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            size={16}
            color={index < rating ? '#ffc107' : '#e4e5e9'}
            style={{ marginRight: '2px' }}
          />
        ))}
      </div>
    );
  };

  const renderExistingReview = (review) => {
    return (
      <Card>
        <Card.Body>
          <h4 className="mb-3">Your Review</h4>
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <strong className="me-2">Rating:</strong>
              <div className="d-flex">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={20}
                    color={index < review.rating ? '#ffc107' : '#e4e5e9'}
                    style={{ marginRight: '2px' }}
                  />
                ))}
              </div>
              
            </div>
            <div>
              <strong className="me-2">Your Comment:</strong>
              <p className="mt-2">{review.comment}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderPackageReviews = () => {
    if (reviewsLoading) {
      return <div className="text-center">Loading reviews...</div>;
    }

    if (packageReviews.length === 0) {
      return <div className="text-center">No reviews yet.</div>;
    }

    return (
      <div className="mt-4">
        {packageReviews.map((review, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <FaUser className="text-secondary me-2" />
                    <span className="text-muted">Anonymous User</span>
                  </div>
                  {renderReviewStars(review.rating)}
                </div>
                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
              <p className="mb-0">{review.comment}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <MainHeader />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainHeader />
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-2" style={{ color: '#000000' }}>Package Details</h2>
            {averageRating > 0 && (
              <div className="bg-light px-3 py-2 rounded-pill d-inline-block">
                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      size={20}
                      color={index < averageRating ? '#ffc107' : '#e4e5e9'}
                      style={{ marginRight: '2px' }}
                    />
                  ))}
                  <span className="ms-2">({averageRating.toFixed(1)})</span>
                </div>
              </div>
            )}
          </div>
          <div className="text-end">
            <h3 className="mb-2" style={{ color: '#1ABC9C' }}>₹{packageDetails?.price}</h3>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleBookNow}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                'Book Now'
              )}
            </Button>
          </div>
        </div>

        <Tab.Container defaultActiveKey="overview">
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="overview" style={{ color: '#000000' }}>Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="hotel" style={{ color: '#000000' }}>Hotel Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="room" style={{ color: '#000000' }}>Room Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="flight" style={{ color: '#000000' }}>Flight Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviews" style={{ color: '#000000' }}>Reviews</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="itinerary" style={{ color: '#000000' }}>Itinerary</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="overview">
              <Card className="mb-4">
                <Card.Body>
                  <h3 className="mb-4" style={{ color: '#000000' }}>Package Overview</h3>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <FaMapMarkerAlt className="text-danger me-2" />
                        <strong>From:</strong> {departureFlight?.origin}
                      </div>
                      <div className="mb-3">
                        <FaMapMarkerAlt className="text-success me-2" />
                        <strong>To:</strong> {departureFlight?.destination}
                      </div>
                      <div className="mb-3">
                        <FaCalendarAlt className="text-info me-2" />
                        <strong>Date:</strong> {new Date(departureFlight?.departureDate).toLocaleDateString()}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <FaClock className="text-warning me-2" />
                        <strong>Departure:</strong> {new Date(departureFlight?.departureTime).toLocaleTimeString()}
                      </div>
                      <div className="mb-3">
                        <FaClock className="text-warning me-2" />
                        <strong>Arrival:</strong> {new Date(departureFlight?.arrivalTime).toLocaleTimeString()}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="hotel">
              {hotel && (
                <Card>
                  <Card.Body>
                    <h3 className="mb-4" style={{ color: '#000000' }}>{hotel.hotelName}</h3>
                    <Carousel interval={null} className="mb-4">
                      {hotelImages.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100"
                            src={`data:${image.contentType};base64,${image.imageData}`}
                            alt={`Hotel view ${index + 1}`}
                            style={{ height: '400px', objectFit: 'cover' }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    <Row>
                      <Col md={6}>
                        <p><strong>Type:</strong> {hotel.type}</p>
                        <p><strong>Location:</strong> {hotel.location}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Price Range:</strong></p>
                        <p className="text-primary fs-5" style={{ color: '#1ABC9C' }}>₹{hotel.lowerCost} - ₹{hotel.upperCost}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="room">
              {room && (
                <Card>
                  <Card.Body>
                    <h3 className="mb-4" style={{ color: '#000000' }}>{room.roomName}</h3>
                    <Carousel interval={null} className="mb-4">
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
                    <Row>
                      <Col md={6}>
                        <div className="d-flex flex-column gap-3">
                          <p className="mb-2">
                            <span title="Room Type">🏠</span>
                            <strong className="ms-2">Room Type:</strong>
                            <span className="ms-2">{room.roomType}</span>
                          </p>
                          <p className="mb-2">
                            <span title="Max Occupancy">👥</span>
                            <strong className="ms-2">Max Occupancy:</strong>
                            <span className="ms-2">{room.maxOccupancy} persons</span>
                          </p>
                          <p className="mb-2">
                            <span title="Food Option">🍽️</span>
                            <strong className="ms-2">Food Option:</strong>
                            <span className="ms-2">{room.foodOption}</span>
                          </p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex flex-column h-100">
                          <div>
                            <p className="mb-4">
                              <span title="Price per Night">💰</span>
                              <strong className="ms-2">Price per Night:</strong>
                              <span style={{ color: '#1ABC9C' }} className="fs-3 ms-2">₹{room.pricePerNight}</span>
                            </p>
                          </div>
                          <div className="mt-auto">
                            <div>
                              <p className="mb-2">
                                <span title="Amenities">✨</span>
                                <strong className="ms-2">Amenities:</strong>
                              </p>
                              <div className="d-flex flex-wrap gap-2">
                                {room.ammenities.map((amenity, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-light text-dark border"
                                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="flight">
              {departureFlight && (
                <>
                  <Card className="mb-4">
                    <Card.Body>
                      <h3 className="mb-4" style={{ color: '#000000' }}>Departure Flight</h3>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <FaMapMarkerAlt className="text-danger me-2" />
                            <strong>From:</strong> {departureFlight.origin}
                          </div>
                          <div className="mb-3">
                            <FaMapMarkerAlt className="text-success me-2" />
                            <strong>To:</strong> {departureFlight.destination}
                          </div>
                          <div className="mb-3">
                            <FaCalendarAlt className="text-info me-2" />
                            <strong>Date:</strong> {new Date(departureFlight.departureDate).toLocaleDateString()}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <FaClock className="text-warning me-2" />
                            <strong>Departure:</strong> {new Date(departureFlight.departureTime).toLocaleTimeString()}
                          </div>
                          <div className="mb-3">
                            <FaClock className="text-warning me-2" />
                            <strong>Arrival:</strong> {new Date(departureFlight.arrivalTime).toLocaleTimeString()}
                          </div>
                          <div className="mb-3">
                            <FaMoneyBillWave className="text-success me-2" />
                            <strong>Price:</strong> <span style={{ color: '#1ABC9C' }} className="fs-4">₹{departureFlight.price}</span>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </>
              )}

              {returnFlight && (
                <Card>
                  <Card.Body>
                    <h3 className="mb-4" style={{ color: '#000000' }}>Return Flight</h3>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <FaMapMarkerAlt className="text-danger me-2" />
                          <strong>From:</strong> {returnFlight.origin}
                        </div>
                        <div className="mb-3">
                          <FaMapMarkerAlt className="text-success me-2" />
                          <strong>To:</strong> {returnFlight.destination}
                        </div>
                        <div className="mb-3">
                          <FaCalendarAlt className="text-info me-2" />
                          <strong>Date:</strong> {new Date(returnFlight.departureDate).toLocaleDateString()}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <FaClock className="text-warning me-2" />
                          <strong>Departure:</strong> {new Date(returnFlight.departureTime).toLocaleTimeString()}
                        </div>
                        <div className="mb-3">
                          <FaClock className="text-warning me-2" />
                          <strong>Arrival:</strong> {new Date(returnFlight.arrivalTime).toLocaleTimeString()}
                        </div>
                        <div className="mb-3">
                          <FaMoneyBillWave className="text-success me-2" />
                          <strong>Price:</strong> <span style={{ color: '#1ABC9C' }} className="fs-4">₹{returnFlight.price}</span>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="reviews">
              <div className="mb-5">
                <h3 className="mb-4" style={{ color: '#000000' }}>Package Reviews</h3>
                <h4 className="mb-3" style={{ color: '#000000' }}>Your Review</h4>
                {existingReview ? (
                  renderExistingReview(existingReview)
                ) : (
                  <SubmitReviews 
                    hotelId={parseInt(packageId)} 
                    onReviewSubmitted={handleReviewSubmitted}
                    isPackageReview={true}
                  />
                )}
              </div>

              <div className="mt-5">
                <h4 className="mb-3" style={{ color: '#000000' }}>All Reviews</h4>
                {renderPackageReviews()}
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="itinerary">
              <Card>
                <Card.Body>
                  <h3 className="mb-4" style={{ color: '#000000' }}>Itinerary Details</h3>
                  {packageDetails?.itineraryNotes?.length > 0 ? (
                    <div className="itinerary-timeline">
                      {packageDetails.itineraryNotes.map((note, index) => (
                        <div key={index} className="timeline-item mb-4">
                          <div className="timeline-content p-3" style={{ 
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                          }}>
                            {note}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No itinerary details available for this package.</p>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
      <Footer />
    </div>
  );
}

export default ViewPackage;