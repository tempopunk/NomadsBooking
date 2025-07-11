import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import MainHeader from '../../../components/MainHeader';
import Footer from '../../../components/Footer';
import FilterComponent from '../../../components/FilterComponent';
import hotelApi from '../api/hotelApi';

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotelImages, setHotelImages] = useState({});
  const [hotelRatings, setHotelRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [hotelTypes, setHotelTypes] = useState(new Set());
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchLocation = searchParams.get('location');

  useEffect(() => {
    const fetchHotelsAndImages = async () => {
      try {
        const hotelData = await hotelApi.searchHotels(searchLocation);
        setHotels(hotelData);
        setFilteredHotels(hotelData);
        
        // Extract unique hotel types
        const types = new Set(hotelData.map(hotel => hotel.type));
        setHotelTypes(types);
        
        // Fetch images and ratings for each hotel
        const [imagesResults, ratingsResults] = await Promise.all([
          Promise.all(hotelData.map(hotel => 
            hotelApi.getHotelImages(hotel.hotelId)
              .then(images => ({ hotelId: hotel.hotelId, images }))
              .catch(() => ({ hotelId: hotel.hotelId, images: [] }))
          )),
          Promise.all(hotelData.map(hotel =>
            hotelApi.getAverageHotelRating(hotel.hotelId)
              .then(rating => ({ hotelId: hotel.hotelId, rating }))
          ))
        ]);
        
        const imagesMap = {};
        imagesResults.forEach(result => {
          imagesMap[result.hotelId] = result.images[0] || null;
        });
        
        const ratingsMap = {};
        ratingsResults.forEach(result => {
          ratingsMap[result.hotelId] = result.rating;
        });
        
        setHotelImages(imagesMap);
        setHotelRatings(ratingsMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch hotels. Please try again.');
        setLoading(false);
      }
    };

    if (searchLocation) {
      fetchHotelsAndImages();
    }
  }, [searchLocation]);

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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...hotels];
    
    // Apply type filter
    if (selectedType) {
      result = result.filter(hotel => hotel.type === selectedType);
    }
    
    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.lowerCost - b.lowerCost;
        } else if (sortBy === 'price-desc') {
          return b.lowerCost - a.lowerCost;
        }
        return 0;
      });
    }
    
    setFilteredHotels(result);
  }, [hotels, selectedType, sortBy]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleViewDetails = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  if (loading) {
    return (
      <div>
        <MainHeader />
        <Container className="py-5">
          <div className="text-center">Loading hotels...</div>
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: '#000000' }}>
            Hotels in {searchLocation}
          </h2>
        </div>
        
        <Row>
          {/* Filter Sidebar */}
          <Col md={3} className="mb-4">
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              <Card.Body>
                <FilterComponent 
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  selectedType={selectedType}
                  onTypeChange={handleTypeChange}
                  types={hotelTypes}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Hotel List */}
          <Col md={9}>
            {filteredHotels.length === 0 ? (
              <div className="text-center p-5 bg-white rounded">
                <h4>No hotels found matching your criteria.</h4>
                <p className="text-muted">Try adjusting your filters or search for a different location.</p>
              </div>
            ) : (
              <Row>
                {filteredHotels.map((hotel) => (
                  <Col xs={12} className="mb-4" key={hotel.hotelId}>
                    <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                      <Row className="g-0">
                        <Col xs={12} md={4} lg={3}>
                          {hotelImages[hotel.hotelId] ? (
                            <div style={{ height: '250px' }}>
                              <img
                                src={`data:${hotelImages[hotel.hotelId].contentType};base64,${hotelImages[hotel.hotelId].imageData}`}
                                alt={hotel.hotelName}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderTopLeftRadius: '0.375rem',
                                  borderBottomLeftRadius: '0.375rem'
                                }}
                              />
                            </div>
                          ) : (
                            <div 
                              className="bg-light d-flex align-items-center justify-content-center"
                              style={{
                                height: '250px',
                                borderTopLeftRadius: '0.375rem',
                                borderBottomLeftRadius: '0.375rem'
                              }}
                            >
                              <span className="text-muted">No Image</span>
                            </div>
                          )}
                        </Col>
                        <Col xs={12} md={8} lg={9}>
                          <Card.Body>
                            <div className="h-100">
                              <div>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div>
                                    <h3 className="h4 mb-2">{hotel.hotelName}</h3>
                                    <div className="d-flex align-items-center text-muted mb-2">
                                      <FaMapMarkerAlt className="me-2" />
                                      <span>{hotel.location}</span>
                                    </div>
                                  </div>
                                  {hotelRatings[hotel.hotelId] !== undefined && (
                                    <div className="bg-light px-3 py-2 rounded-pill">
                                      {renderRatingStars(hotelRatings[hotel.hotelId])}
                                    </div>
                                  )}
                                </div>
                                <div className="mb-3">
                                  <span className="badge bg-info me-2">{hotel.type}</span>
                                </div>
                              </div>
                              <div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="text-muted">Price Range</div>
                                    <div className="fs-5 fw-bold" style={{ color: '#1ABC9C' }}>
                                      ₹{hotel.lowerCost} - ₹{hotel.upperCost}
                                    </div>
                                  </div>
                                  <button 
                                    className="btn"
                                    onClick={() => handleViewDetails(hotel.hotelId)}
                                    style={{
                                      backgroundColor: '#F39C12',
                                      color: 'white'
                                    }}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default HotelList;