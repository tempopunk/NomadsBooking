import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMoneyBillWave, FaPlane, FaStar } from 'react-icons/fa';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import packageApi from '../api/packageApi';
import hotelApi from '../../hotelandflightbooking/api/hotelApi';

function PackageList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [packageRatings, setPackageRatings] = useState({});

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');
        const departureDate = searchParams.get('departureDate');

        const data = await packageApi.searchPackages(origin, destination, departureDate);
        setPackages(data);
        setFilteredPackages(data);

        // Fetch ratings for all packages
        const ratingsMap = {};
        await Promise.all(
          data.map(async (pkg) => {
            const rating = await hotelApi.getAveragePackageRating(pkg.packageId);
            ratingsMap[pkg.packageId] = rating;
          })
        );
        setPackageRatings(ratingsMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages. Please try again later.');
        setLoading(false);
      }
    };

    fetchPackages();
  }, [searchParams]);

  useEffect(() => {
    let sorted = [...packages];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilteredPackages(sorted);
  }, [packages, sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
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
          <h2 className="mb-0" style={{ color: '#000000' }}>Available Packages</h2>
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
          {filteredPackages.length === 0 ? (
            <Col>
              <Alert variant="info">No packages found for your search criteria.</Alert>
            </Col>
          ) : (
            filteredPackages.map((pkg) => (
              <Col xs={12} className="mb-4" key={pkg.packageId}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={9}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="package-icon-wrapper me-3">
                              <FaPlane className="text-primary" size={24} />
                            </div>
                            <h5 className="card-title mb-0">Package #{pkg.packageId}</h5>
                          </div>
                          {packageRatings[pkg.packageId] !== undefined && (
                            <div className="bg-light px-3 py-2 rounded-pill">
                              {renderRatingStars(packageRatings[pkg.packageId])}
                            </div>
                          )}
                        </div>
                        <Row>
                          <Col md={6}>
                            <div className="mb-2">
                              <FaMapMarkerAlt className="text-danger me-2" />
                              <strong>From:</strong> {pkg.origin}
                            </div>
                            <div className="mb-2">
                              <FaMapMarkerAlt className="text-success me-2" />
                              <strong>To:</strong> {pkg.destination}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-2">
                              <FaCalendarAlt className="text-info me-2" />
                              <strong>Departure:</strong> {new Date(pkg.departureDate).toLocaleDateString()}
                            </div>
                            <div className="mb-2">
                              <FaClock className="text-warning me-2" />
                              <strong>Duration:</strong> {pkg.numberOfDays} days
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={3} className="d-flex flex-column justify-content-center align-items-center border-start">
                        <div className="text-center mb-3">
                          <FaMoneyBillWave className="text-success mb-2" size={24} />
                          <div>
                            <strong>Price</strong>
                            <div style={{ color: '#1ABC9C' }} className="fs-4">₹{pkg.price}</div>
                          </div>
                        </div>
                        <button 
                          className="btn btn-primary w-100"
                          onClick={() => handleViewPackage(pkg.packageId)}
                        >
                          View Package
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

export default PackageList;