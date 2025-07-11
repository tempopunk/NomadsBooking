import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaUser, FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import SubmitReviews from '../../../components/SubmitReviews';
import packageApi from '../../travelpackage/api/packageApi';
import hotelApi from '../api/hotelApi';
import reviewApi from '../../reviews/api/reviewApi';

function ViewFlight() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [flightReviews, setFlightReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const [flightData, rating] = await Promise.all([
          packageApi.viewFlight(flightId),
          hotelApi.getAverageFlightRating(flightId)
        ]);
        
        setFlight(flightData);
        setAverageRating(rating);

        // Check for existing review
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const reviewData = await reviewApi.alreadyReviewedFlight(parseInt(userId), parseInt(flightId));
            setExistingReview(reviewData);
          } catch (err) {
            console.error('Error fetching review:', err);
          }
        }

        // Fetch flight reviews
        try {
          const reviews = await reviewApi.getReviewsByFlight(flightId);
          setFlightReviews(reviews);
        } catch (err) {
          console.error('Error fetching flight reviews:', err);
        }
        setReviewsLoading(false);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flight details. Please try again.');
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    if (flightId) {
      fetchFlightDetails();
    }
  }, [flightId]);

  const handleBookNow = async () => {
    setIsProcessing(true);
    setCheckoutError(null);
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Please login to book a flight');
      }
      
      const paymentResponse = await hotelApi.checkoutFlight(userId, flightId);
      
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
      const [reviewData, reviews] = await Promise.all([
        reviewApi.alreadyReviewedFlight(parseInt(userId), parseInt(flightId)),
        reviewApi.getReviewsByFlight(flightId)
      ]);
      setExistingReview(reviewData);
      setFlightReviews(reviews);
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

  const renderFlightReviews = () => {
    if (reviewsLoading) {
      return <div className="text-center">Loading reviews...</div>;
    }

    if (flightReviews.length === 0) {
      return <div className="text-center">No reviews yet.</div>;
    }

    return (
      <div className="mt-4">
        {flightReviews.map((review, index) => (
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
                  {new Date(review.reviewDate).toLocaleDateString()}
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
          <h2 className="mb-0" style={{ color: '#000000' }}>Flight Details</h2>
          <div>
            {checkoutError && (
              <Alert variant="danger" className="mb-3">
                {checkoutError}
              </Alert>
            )}
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

        <Card className="mb-5">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <FaPlane className="text-primary me-2" size={24} />
                <h3 className="mb-0" style={{ color: '#000000' }}>{flight?.companyName}</h3>
              </div>
              {averageRating > 0 && (
                <div className="bg-light px-3 py-2 rounded-pill">
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
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <FaMapMarkerAlt className="text-danger me-2" />
                  <strong>From:</strong> {flight?.origin}
                </div>
                <div className="mb-3">
                  <FaMapMarkerAlt className="text-success me-2" />
                  <strong>To:</strong> {flight?.destination}
                </div>
                <div className="mb-3">
                  <FaCalendarAlt className="text-info me-2" />
                  <strong>Date:</strong> {new Date(flight?.departureDate).toLocaleDateString()}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <FaClock className="text-warning me-2" />
                  <strong>Departure:</strong> {new Date(flight?.departureTime).toLocaleTimeString()}
                </div>
                <div className="mb-3">
                  <FaClock className="text-warning me-2" />
                  <strong>Arrival:</strong> {new Date(flight?.arrivalTime).toLocaleTimeString()}
                </div>
                <div className="mb-3">
                  <FaMoneyBillWave className="text-success me-2" />
                  <strong>Price:</strong> <span style={{ color: '#1ABC9C' }} className="fs-4">₹{flight?.price}</span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Review Section */}
        <div className="mt-5">
          <h3 className="mb-4" style={{ color: '#000000' }}>Flight Reviews</h3>
          <div className="mb-5">
            <h4 className="mb-3" style={{ color: '#000000' }}>Your Review</h4>
            {existingReview ? (
              renderExistingReview(existingReview)
            ) : (
              <SubmitReviews 
                hotelId={parseInt(flightId)} 
                onReviewSubmitted={handleReviewSubmitted}
                isFlightReview={true}
              />
            )}
          </div>

          <div className="mt-5">
            <h4 className="mb-3" style={{ color: '#000000' }}>All Reviews</h4>
            {renderFlightReviews()}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default ViewFlight;