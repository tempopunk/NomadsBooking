import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FaPlane, FaHotel, FaMapMarkedAlt, FaSearch } from 'react-icons/fa';
import '../../../Home.css';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';

function Home() {
  const [key, setKey] = useState('hotel');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [packageOrigin, setPackageOrigin] = useState('');
  const [packageDestination, setPackageDestination] = useState('');
  const [packageDepartureDate, setPackageDepartureDate] = useState('');
  const [packageTravelers, setPackageTravelers] = useState(1);
  const [flightOrigin, setFlightOrigin] = useState('');
  const [flightDestination, setFlightDestination] = useState('');
  const [flightDepartureDate, setFlightDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();

  const handleHotelSearch = (e) => {
    e.preventDefault();
    navigate(`/hotels?location=${encodeURIComponent(location)}`);
  };

  const handlePackageSearch = (e) => {
    e.preventDefault();
    navigate(`/packages?origin=${encodeURIComponent(packageOrigin)}&destination=${encodeURIComponent(packageDestination)}&departureDate=${packageDepartureDate}`);
  };

  const handleFlightSearch = (e) => {
    e.preventDefault();
    navigate(`/flights?origin=${encodeURIComponent(flightOrigin)}&destination=${encodeURIComponent(flightDestination)}&departureDate=${flightDepartureDate}&passengers=${passengers}`);
  };

  const getHeadingText = () => {
    switch(key) {
      case 'flight':
        return 'Find Your Perfect Flight';
      case 'package':
        return 'Find Your Perfect Vacation';
      default:
        return 'Find Your Perfect Stay';
    }
  };

  return (
    <div className="home-page">
      <MainHeader />
      <div className="hero-section">
        <Container>
          <h1 className="text-center mb-4">{getHeadingText()}</h1>
          <Card className="search-card">
            <Card.Body>
              <Tabs
                id="search-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
              >
                <Tab 
                  eventKey="hotel" 
                  title={
                    <span className={key === 'hotel' ? 'active-tab' : 'inactive-tab'}>
                      <FaHotel className="me-2" />Hotels
                    </span>
                  }
                >
                  <Form onSubmit={handleHotelSearch}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Where are you going?"
                            className="search-input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Check-in Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            className="search-input"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Check-out Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            className="search-input"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || new Date().toISOString().split('T')[0]}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Guests</Form.Label>
                          <Form.Control 
                            type="number" 
                            placeholder="Number of guests"
                            min="1"
                            className="search-input"
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-center mt-3">
                      <Button 
                        type="submit"
                        variant="primary" 
                        size="lg"
                        className="search-button"
                      >
                        <FaSearch className="me-2" />Search Hotels
                      </Button>
                    </div>
                  </Form>
                </Tab>
                <Tab 
                  eventKey="flight" 
                  title={
                    <span className={key === 'flight' ? 'active-tab' : 'inactive-tab'}>
                      <FaPlane className="me-2" />Flights
                    </span>
                  }
                >
                  <Form onSubmit={handleFlightSearch}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>From</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Departure city"
                            className="search-input"
                            value={flightOrigin}
                            onChange={(e) => setFlightOrigin(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>To</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Arrival city"
                            className="search-input"
                            value={flightDestination}
                            onChange={(e) => setFlightDestination(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Departure Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            className="search-input"
                            value={flightDepartureDate}
                            onChange={(e) => setFlightDepartureDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Passengers</Form.Label>
                          <Form.Control 
                            type="number" 
                            placeholder="Number of passengers"
                            className="search-input"
                            value={passengers}
                            onChange={(e) => setPassengers(parseInt(e.target.value))}
                            min="1"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-center mt-3">
                      <Button 
                        type="submit"
                        variant="primary" 
                        size="lg"
                        className="search-button"
                      >
                        <FaSearch className="me-2" />Search Flights
                      </Button>
                    </div>
                  </Form>
                </Tab>
                <Tab 
                  eventKey="package" 
                  title={
                    <span className={key === 'package' ? 'active-tab' : 'inactive-tab'}>
                      <FaMapMarkedAlt className="me-2" />Packages
                    </span>
                  }
                >
                  <Form onSubmit={handlePackageSearch}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Origin</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Enter your departure city"
                            className="search-input"
                            value={packageOrigin}
                            onChange={(e) => setPackageOrigin(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Destination</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Where do you want to go?"
                            className="search-input"
                            value={packageDestination}
                            onChange={(e) => setPackageDestination(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Departure Date</Form.Label>
                          <Form.Control 
                            type="date" 
                            className="search-input"
                            value={packageDepartureDate}
                            onChange={(e) => setPackageDepartureDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Travelers</Form.Label>
                          <Form.Control 
                            type="number" 
                            placeholder="Number of travelers"
                            min="1"
                            className="search-input"
                            value={packageTravelers}
                            onChange={(e) => setPackageTravelers(parseInt(e.target.value))}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-center mt-3">
                      <Button 
                        type="submit"
                        variant="primary" 
                        size="lg"
                        className="search-button"
                      >
                        <FaSearch className="me-2" />Search Packages
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <Container className="services-section py-5">
        <h2 className="text-center mb-5">Our Services</h2>
        <Row>
          <Col md={4}>
            <Card className="service-card mb-4">
              <Card.Body>
                <FaPlane className="service-icon" />
                <Card.Title>Flight Booking</Card.Title>
                <Card.Text>
                  Book flights to destinations worldwide with best prices and flexible options.
                </Card.Text>
                <Button variant="outline-primary">Search Flights</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="service-card mb-4">
              <Card.Body>
                <FaHotel className="service-icon" />
                <Card.Title>Hotel Booking</Card.Title>
                <Card.Text>
                  Find and book accommodations that suit your style and budget.
                </Card.Text>
                <Button variant="outline-primary">Find Hotels</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="service-card mb-4">
              <Card.Body>
                <FaMapMarkedAlt className="service-icon" />
                <Card.Title>Travel Packages</Card.Title>
                <Card.Text>
                  Discover curated travel packages for unforgettable experiences.
                </Card.Text>
                <Button variant="outline-primary">View Packages</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;