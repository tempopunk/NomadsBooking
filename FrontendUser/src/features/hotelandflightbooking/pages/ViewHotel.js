import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaUser } from 'react-icons/fa';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import SubmitReviews from '../../../components/SubmitReviews';
import hotelApi from '../api/hotelApi';
import reviewApi from '../../../features/reviews/api/reviewApi';

function ViewHotel() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [hotelImages, setHotelImages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [hotelReviews, setHotelReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const { hotelId } = useParams();

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        // Store hotelId in sessionStorage
        sessionStorage.setItem('currentHotelId', hotelId);

        // Fetch hotel details, images, rooms, and rating in parallel
        const [hotelData, images, roomsData, rating] = await Promise.all([
          hotelApi.getHotelById(hotelId),
          hotelApi.getHotelImages(hotelId),
          hotelApi.viewRooms(hotelId),
          hotelApi.getAverageHotelRating(hotelId)
        ]);

        setHotel(hotelData);
        setHotelImages(images);
        setRooms(roomsData);
        setAverageRating(rating);

        // Check for existing review
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const reviewData = await reviewApi.alreadyReviewed(parseInt(userId), parseInt(hotelId));
            setExistingReview(reviewData);
          } catch (err) {
            console.error('Error fetching review:', err);
          }
        }

        // Fetch hotel reviews
        try {
          const reviews = await reviewApi.getReviewsByHotel(hotelId);
          setHotelReviews(reviews);
        } catch (err) {
          console.error('Error fetching hotel reviews:', err);
        }
        setReviewsLoading(false);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch hotel details. Please try again.');
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId]);

  const handleViewRoom = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleReviewSubmitted = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const [reviewData, hotelReviews] = await Promise.all([
        reviewApi.alreadyReviewed(parseInt(userId), parseInt(hotelId)),
        reviewApi.getReviewsByHotel(hotelId)
      ]);
      setExistingReview(reviewData);
      setHotelReviews(hotelReviews);
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
      <Card style={{ backgroundColor: 'transparent' }}>
        <Card.Body style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
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

  const renderHotelReviews = () => {
    if (reviewsLoading) {
      return <div className="text-center">Loading reviews...</div>;
    }

    if (hotelReviews.length === 0) {
      return <div className="text-center">No reviews yet.</div>;
    }

    return (
      <div className="mt-4">
        {hotelReviews.map((review, index) => (
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
      <div>
        <MainHeader />
        <Container className="py-5">
          <div className="text-center">Loading hotel details...</div>
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
        {/* Hotel Name */}
        <h1 className="display-4 mb-4 text-center" style={{ color: '#000000' }}>{hotel?.hotelName}</h1>

        {/* Image Carousel */}
        <div className="mb-5">
          <Carousel interval={null} className="hotel-carousel">
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
        </div>

        {/* Hotel Details */}
        <div className="mb-5">
          <Row>
            <Col md={6}>
              <p><strong>Type:</strong> {hotel?.type}</p>
              <p><strong>Location:</strong> {hotel?.location}</p>
              <div className="mb-3">
                <strong>Rating:</strong>
                <div className="d-flex align-items-center mt-1">
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
            </Col>
            <Col md={6}>
              <p><strong>Price Range:</strong></p>
              <p className="fs-5" style={{ color: '#1ABC9C' }}>
                ₹{hotel?.lowerCost} - ₹{hotel?.upperCost}
              </p>
            </Col>
          </Row>
        </div>

        {/* Available Rooms */}
        <h3 className="mb-4" style={{ color: '#000000' }}>Available Rooms</h3>
        <div className="mb-5">
          {rooms.map((room) => (
            <Card key={room.roomId} className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Card.Title className="h4 mb-3" style={{ color: '#000000' }}>{room.roomName}</Card.Title>
                    <Row>
                      <Col md={6}>
                        <div className="d-flex flex-column gap-2">
                          <p className="mb-2">
                            <span title="Room Type">🏠</span> {room.roomType}
                          </p>
                          <p className="mb-2">
                            <span title="Max Occupancy">👥</span> {room.maxOccupancy} persons
                          </p>
                          <p className="mb-2">
                            <span title="Food Option">🍽️</span> {room.foodOption}
                          </p>
                          <p className="mb-2">
                            <span title="Price per Night">💰</span>
                            <span className="fs-5 ms-2" style={{ color: '#1ABC9C' }}>₹{room.pricePerNight}</span>
                          </p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <p><span title="Amenities">✨</span> <strong>Amenities:</strong></p>
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
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4} className="d-flex align-items-center justify-content-end">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => handleViewRoom(room.roomId)}
                    >
                      View Room
                    </button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Review Section */}
        <div className="mt-5">
          <h3 className="mb-4" style={{ color: '#000000' }}>Hotel Reviews</h3>
          <div className="mb-5">
            <h4 className="mb-3" style={{ color: '#000000' }}>Your Review</h4>
            {existingReview ? (
              renderExistingReview(existingReview)
            ) : (
              <SubmitReviews 
                hotelId={parseInt(hotelId)} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}
          </div>

          <div className="mt-5">
            <h4 className="mb-3" style={{ color: '#000000' }}>All Reviews</h4>
            {renderHotelReviews()}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default ViewHotel;