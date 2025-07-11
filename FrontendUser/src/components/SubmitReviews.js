import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import reviewApi from '../features/reviews/api/reviewApi';

const SubmitReviews = ({ 
  hotelId, 
  onReviewSubmitted,
  isPackageReview = false,
  isFlightReview = false
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const userId = localStorage.getItem('userId');
      const reviewData = {
        userId: parseInt(userId),
        rating,
        comment,
        reviewDate: new Date().toISOString()
      };

      if (isPackageReview) {
        reviewData.packageId = hotelId; // hotelId is actually packageId in this case
      } else if (isFlightReview) {
        reviewData.flightId = hotelId; // hotelId is actually flightId in this case
      } else {
        reviewData.hotelId = hotelId;
      }

      await reviewApi.submitReview(reviewData);
      setSuccess(true);
      setRating(0);
      setComment('');
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h4 className="mb-3">Submit Your Review</h4>
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Review submitted successfully!
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <Form.Label className="me-3 mb-0">Rating:</Form.Label>
            <div className="star-rating d-flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    size={24}
                    className="me-1"
                    style={{ cursor: 'pointer' }}
                    color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Your Review:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            required
          />
        </Form.Group>

        <Button 
          type="submit" 
          variant="primary"
          disabled={loading || rating === 0}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>

      <style jsx="true">{`
        .review-form-container {
          padding: 20px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .star-rating {
          display: flex;
          align-items: center;
        }
        .star {
          transition: color 200ms;
        }
      `}</style>
    </div>
  );
};

export default SubmitReviews;