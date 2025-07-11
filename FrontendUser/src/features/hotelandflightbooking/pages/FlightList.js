import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import hotelApi from '../api/hotelApi';

function FlightList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [flightRatings, setFlightRatings] = useState({});

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const departureDate = searchParams.get('departureDate');

        const response = await hotelApi.searchFlights(origin, destination, departureDate);
        setFlights(response);
        setFilteredFlights(response);

        // Fetch ratings for all flights
        const ratingsMap = {};
        await Promise.all(
          response.map(async (flight) => {
            const rating = await hotelApi.getAverageFlightRating(flight.flightId);
            ratingsMap[flight.flightId] = rating;
          })
        );
        setFlightRatings(ratingsMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch flights. Please try again later.');
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  useEffect(() => {
    let sorted = [...flights];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilteredFlights(sorted);
  }, [flights, sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleViewDetails = (flightId) => {
    navigate(`/flights/${flightId}`);
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            size={16}
            color={index < rating ? '#ffc107' : '#e4e5e9'}
            style={{ marginRight: '2px' }}
          />
        ))}
        <span className="ms-1">({rating.toFixed(1)})</span>
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

  return (
    <div style={{ backgroundColor: '#FDEFE1', minHeight: '100vh' }}>
      <MainHeader />
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ color: '#000000' }}>Available Flights</h2>
          <Form.Select 
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Form.Select>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          {filteredFlights.length === 0 ? (
            <Col>
              <Alert variant="info">No flights found for your search criteria.</Alert>
            </Col>
          ) : (
            filteredFlights.map((flight) => (
              <Col xs={12} className="mb-4" key={flight.flightId}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={9}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="flight-icon-wrapper me-3">
                              <FaPlane className="text-primary" size={24} />
                            </div>
                            <h5 className="card-title mb-0">{flight.companyName}</h5>
                          </div>
                          {flightRatings[flight.flightId] !== undefined && (
                            <div className="bg-light px-3 py-2 rounded-pill">
                              {renderRatingStars(flightRatings[flight.flightId])}
                            </div>
                          )}
                        </div>
                        <Row>
                          <Col md={6}>
                            <div className="mb-2">
                              <FaMapMarkerAlt className="text-danger me-2" />
                              <strong>From:</strong> {flight.origin}
                            </div>
                            <div className="mb-2">
                              <FaMapMarkerAlt className="text-success me-2" />
                              <strong>To:</strong> {flight.destination}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-2">
                              <FaCalendarAlt className="text-info me-2" />
                              <strong>Date:</strong> {new Date(flight.departureDate).toLocaleDateString()}
                            </div>
                            <div className="mb-2">
                              <FaClock className="text-warning me-2" />
                              <strong>Time:</strong> {new Date(flight.departureTime).toLocaleTimeString()} - {new Date(flight.arrivalTime).toLocaleTimeString()}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={3} className="d-flex flex-column justify-content-center align-items-center border-start">
                        <div className="text-center mb-3">
                          <FaMoneyBillWave className="text-success mb-2" size={24} />
                          <div>
                            <strong>Price</strong>
                            <div style={{ color: '#1ABC9C' }} className="fs-4">₹{flight.price}</div>
                          </div>
                        </div>
                        <button 
                          className="btn btn-primary w-100"
                          onClick={() => handleViewDetails(flight.flightId)}
                        >
                          View Details
                        </button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default FlightList;