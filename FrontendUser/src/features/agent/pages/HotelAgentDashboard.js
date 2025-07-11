import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import theme from '../../../theme';
import AgentHeader from '../../../components/AgentHeader';
import Footer from '../../../components/Footer';
import hotelAgentApi from '../api/hotelAgentApi';

function HotelAgentDashboard() {
  const [hotel, setHotel] = useState(null);
  const [hotelId, setHotelId] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [hotelImages, setHotelImages] = useState([]);
  const [roomImages, setRoomImages] = useState({});
  const [newAmenity, setNewAmenity] = useState('');
  const [supportTickets, setSupportTickets] = useState([]);
  const navigate = useNavigate();

  // Form states for hotel
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    type: '',
    lowerCost: '',
    upperCost: '',
    costRange: ''
  });

  // Form states for room
  const [roomForm, setRoomForm] = useState({
    roomName: '',
    roomType: '',
    pricePerNight: '',
    maxOccupancy: '',
    foodOption: '',
    ammenities: []
  });

  useEffect(() => {
    fetchHotelId();
    fetchSupportTickets();
  }, []);

  useEffect(() => {
    if (hotelId !== 0) {
      const fetchBookings = async () => {
        try {
          const bookingsData = await hotelAgentApi.getHotelBookings(hotelId);
          setBookings(bookingsData);
        } catch (err) {
          console.error('Failed to fetch bookings');
          setError('Failed to fetch bookings');
        }
      };
      fetchBookings();
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId !== 0) {
      const fetchImages = async () => {
        try {
          const images = await hotelAgentApi.getHotelImages(hotelId);
          setHotelImages(images);
        } catch (err) {
          console.error('Failed to fetch images');
        }
      };
      fetchImages();
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotel?.rooms) {
      const fetchRoomImages = async () => {
        const imagesMap = {};
        for (const room of hotel.rooms) {
          try {
            const images = await hotelAgentApi.getRoomImages(room.roomId);
            imagesMap[room.roomId] = images;
          } catch (err) {
            console.error(`Failed to fetch images for room ${room.roomId}`);
          }
        }
        setRoomImages(imagesMap);
      };
      fetchRoomImages();
    }
  }, [hotel?.rooms]);

  const fetchHotelId = async () => {
    try {
      const agentId = localStorage.getItem('userId');
      const id = await hotelAgentApi.getHotelId(agentId);
      setHotelId(id);
      
      if (id !== 0) {
        const hotelData = await hotelAgentApi.getHotelDetails(id);
        setHotel(hotelData);
        if (hotelData) {
          setHotelForm({
            name: hotelData.name || '',
            location: hotelData.location || '',
            type: hotelData.type || '',
            lowerCost: hotelData.lowerCost || '',
            upperCost: hotelData.upperCost || '',
            costRange: hotelData.costRange || ''
          });
        }
      }
    } catch (err) {
      setError('Failed to fetch hotel data');
      console.error(err);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      const agentId = localStorage.getItem('userId');
      const tickets = await hotelAgentApi.getAgentSupportTickets(agentId);
      setSupportTickets(tickets);
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
      setError('Failed to fetch support tickets');
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const agentId = localStorage.getItem('userId');
      const response = await hotelAgentApi.addHotel(agentId, {
        ...hotelForm,
        lowerCost: parseFloat(hotelForm.lowerCost),
        upperCost: parseFloat(hotelForm.upperCost),
        costRange: parseFloat(hotelForm.costRange)
      });

      if (response) {
        await fetchHotelId(); // Refresh hotel data
        setActiveTab('hotel'); // Switch to hotel tab
      }
    } catch (err) {
      setError(err.message || 'Failed to save hotel');
    }
    setLoading(false);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!hotel) return;
    
    setLoading(true);
    try {
      const response = await hotelAgentApi.addRoom(hotelId, {
        ...roomForm,
        pricePerNight: parseFloat(roomForm.pricePerNight),
        maxOccupancy: parseInt(roomForm.maxOccupancy)
      });
      
      if (response) {
        await fetchHotelId(); // This will refresh the hotel data including rooms
        setRoomForm({
          roomName: '',
          roomType: '',
          pricePerNight: '',
          maxOccupancy: '',
          foodOption: '',
          ammenities: []
        });
      }
    } catch (err) {
      setError('Failed to add room');
    }
    setLoading(false);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    setLoading(true);
    try {
      await hotelAgentApi.deleteRoom(roomId, hotelId);
      await fetchHotelId(); // This will refresh the hotel data including rooms
    } catch (err) {
      setError('Failed to delete room');
    }
    setLoading(false);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      await hotelAgentApi.uploadHotelImages(hotelId, files);
      const images = await hotelAgentApi.getHotelImages(hotelId);
      setHotelImages(images);
    } catch (err) {
      setError('Failed to upload images');
    }
    setLoading(false);
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    setLoading(true);
    try {
      await hotelAgentApi.deleteHotelImage(hotelId, imageId);
      const images = await hotelAgentApi.getHotelImages(hotelId);
      setHotelImages(images);
    } catch (err) {
      setError('Failed to delete image');
    }
    setLoading(false);
  };

  const handleRoomImageUpload = async (roomId, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      await hotelAgentApi.uploadRoomImages(roomId, files);
      const images = await hotelAgentApi.getRoomImages(roomId);
      setRoomImages(prev => ({
        ...prev,
        [roomId]: images
      }));
    } catch (err) {
      setError('Failed to upload room images');
    }
    setLoading(false);
  };

  const handleDeleteRoomImage = async (roomId, imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    setLoading(true);
    try {
      await hotelAgentApi.deleteRoomImage(roomId, imageId);
      const images = await hotelAgentApi.getRoomImages(roomId);
      setRoomImages(prev => ({
        ...prev,
        [roomId]: images
      }));
    } catch (err) {
      setError('Failed to delete room image');
    }
    setLoading(false);
  };

  const handleAmenityChange = (amenity) => {
    setRoomForm(prev => {
      const currentAmenities = prev.ammenities || [];
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          ammenities: currentAmenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          ammenities: [...currentAmenities, amenity]
        };
      }
    });
  };

  const handleAddAmenity = (e) => {
    e.preventDefault(); // Prevent any form submission
    if (newAmenity.trim()) {
      setRoomForm(prev => ({
        ...prev,
        ammenities: [...(prev.ammenities || []), newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setRoomForm(prev => ({
      ...prev,
      ammenities: prev.ammenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFF3E0'
    }}>
      <AgentHeader />

      <main style={{ flex: 1, padding: theme.spacing.xl }}>
        <div className="container">
          <h1 className="text-center mb-4" style={{ color: '#000000' }}>
            Hotel Management Dashboard
          </h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'hotel' ? 'active' : ''}`}
                onClick={() => setActiveTab('hotel')}
              >
                My Hotel
              </button>
            </li>
            {hotelId !== 0 && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rooms')}
                >
                  My Rooms
                </button>
              </li>
            )}
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
                onClick={() => setActiveTab('tickets')}
              >
                My Tickets
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* Bookings Tab */}
            <div className={`tab-pane fade ${activeTab === 'bookings' ? 'show active' : ''}`}>
              <div className="bg-white rounded p-4">
                <h2 className="mb-4">Recent Bookings</h2>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Room</th>
                        <th>Amount</th>
                        
                        <th>Booking Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.bookingId}>
                          <td>{booking.bookingId}</td>
                          <td>{booking.room.roomName}</td>
                          <td>{booking.totalAmount}</td>
                          <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          <td>{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Hotel Tab */}
            <div className={`tab-pane fade ${activeTab === 'hotel' ? 'show active' : ''}`}>
              <div className="bg-white rounded p-4">
                {hotelId === 0 ? (
                  <>
                    <h2 className="mb-4">Add Your Hotel</h2>
                    <form onSubmit={handleHotelSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Hotel Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={hotelForm.name}
                            onChange={(e) => setHotelForm(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Location:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={hotelForm.location}
                            onChange={(e) => setHotelForm(prev => ({
                              ...prev,
                              location: e.target.value
                            }))}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Hotel Type:</label>
                          <select
                            className="form-select"
                            value={hotelForm.type}
                            onChange={(e) => setHotelForm(prev => ({
                              ...prev,
                              type: e.target.value
                            }))}
                            required
                          >
                            <option value="">Select hotel type</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Business">Business</option>
                            <option value="Resort">Resort</option>
                            <option value="Boutique">Boutique</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Lower Cost:</label>
                          <input
                            type="number"
                            className="form-control"
                            value={hotelForm.lowerCost}
                            onChange={(e) => setHotelForm(prev => ({
                              ...prev,
                              lowerCost: e.target.value
                            }))}
                            required
                            min="0"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Upper Cost:</label>
                          <input
                            type="number"
                            className="form-control"
                            value={hotelForm.upperCost}
                            onChange={(e) => setHotelForm(prev => ({
                              ...prev,
                              upperCost: e.target.value
                            }))}
                            required
                            min="0"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Cost Range:</label>
                          <input
                            type="number"
                            className="form-control"
                            value={hotelForm.costRange}
                            onChange={(e) => setHotelForm(prev => ({
                              ...prev,
                              costRange: e.target.value
                            }))}
                            required
                            min="0"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-warning mt-4"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Add Hotel'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <div className="mb-3">
                        <h2 className="card-title">{hotel?.hotelName}</h2>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Location:</strong></p>
                          <p>{hotel?.location}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Type:</strong></p>
                          <p>{hotel?.type}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Price Range:</strong></p>
                          <p>₹{hotel?.lowerCost} - ₹{hotel?.upperCost}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Cost Range:</strong></p>
                          <p>₹{hotel?.costRange}</p>
                        </div>
                      </div>

                      {/* Hotel Images Section */}
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3>Hotel Images</h3>
                          <div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="d-none"
                              id="imageUpload"
                            />
                            <label htmlFor="imageUpload" className="btn btn-warning" style={{ cursor: 'pointer' }}>
                              Add Images
                            </label>
                          </div>
                        </div>

                        <div className="row g-4">
                          {hotelImages.map((image, index) => (
                            <div key={image.id} className="col-md-4 col-lg-3">
                              <div className="card h-100">
                                <img
                                  src={`data:${image.contentType};base64,${image.imageData}`}
                                  className="card-img-top"
                                  alt={`Hotel image ${index + 1}`}
                                  style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                  <button
                                    className="btn btn-danger btn-sm w-100"
                                    onClick={() => handleDeleteImage(image.id)}
                                    disabled={loading}
                                  >
                                    Delete Image
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {hotelImages.length === 0 && (
                          <div className="alert alert-info">
                            No images uploaded yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rooms Tab */}
            <div className={`tab-pane fade ${activeTab === 'rooms' ? 'show active' : ''}`}>
              <div className="bg-white rounded p-4">
                <h2 className="mb-4">Hotel Rooms</h2>
                
                <div className="row g-4">
                  {hotel?.rooms?.map(room => (
                    <div key={room.roomId} className="col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title">Room {room.roomName}</h5>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteRoom(room.roomId)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </div>

                          {/* Room Images Section */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">Room Images</h6>
                              <div>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleRoomImageUpload(room.roomId, e)}
                                  className="d-none"
                                  id={`imageUpload-${room.roomId}`}
                                />
                                <label 
                                  htmlFor={`imageUpload-${room.roomId}`} 
                                  className="btn btn-warning btn-sm" 
                                  style={{ cursor: 'pointer' }}
                                >
                                  Add Images
                                </label>
                              </div>
                            </div>

                            <div className="row g-2">
                              {roomImages[room.roomId]?.map((image, index) => (
                                <div key={image.id} className="col-6">
                                  <div className="card">
                                    <img
                                      src={`data:${image.contentType};base64,${image.imageData}`}
                                      className="card-img-top"
                                      alt={`Room ${room.roomName} image ${index + 1}`}
                                      style={{ height: '100px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body p-2">
                                      <button
                                        className="btn btn-danger btn-sm w-100"
                                        onClick={() => handleDeleteRoomImage(room.roomId, image.id)}
                                        disabled={loading}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {(!roomImages[room.roomId] || roomImages[room.roomId].length === 0) && (
                              <div className="text-muted small mt-2">
                                No images uploaded yet
                              </div>
                            )}
                          </div>

                          <div className="mb-3">
                            <span className="badge bg-primary me-2">{room.roomType}</span>
                            <span className="badge bg-success">₹{room.pricePerNight}/night</span>
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Max Occupancy:</strong> {room.maxOccupancy} persons</p>
                            <p className="mb-1"><strong>Food Option:</strong> {room.foodOption}</p>
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Amenities:</strong></p>
                            <div className="d-flex flex-wrap gap-2">
                              {room.ammenities.map((amenity, index) => (
                                <span key={index} className="badge bg-secondary">{amenity}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {(!hotel?.rooms || hotel.rooms.length === 0) && (
                  <div className="alert alert-info mb-4">
                    No rooms available for this hotel.
                  </div>
                )}

                <div className="card mt-4">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Add New Room</h3>
                    <form onSubmit={handleRoomSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Room Number:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={roomForm.roomName}
                            onChange={(e) => setRoomForm(prev => ({
                              ...prev,
                              roomName: e.target.value
                            }))}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Room Type:</label>
                          <select
                            className="form-select"
                            value={roomForm.roomType}
                            onChange={(e) => setRoomForm(prev => ({
                              ...prev,
                              roomType: e.target.value
                            }))}
                            required
                          >
                            <option value="">Select room type</option>
                            <option value="Standard Queen">Standard Queen</option>
                            <option value="Deluxe King">Deluxe King</option>
                            <option value="Executive Suite">Executive Suite</option>
                            <option value="Family Room">Family Room</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Price Per Night:</label>
                          <input
                            type="number"
                            className="form-control"
                            value={roomForm.pricePerNight}
                            onChange={(e) => setRoomForm(prev => ({
                              ...prev,
                              pricePerNight: parseFloat(e.target.value)
                            }))}
                            required
                            min="0"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Max Occupancy:</label>
                          <input
                            type="number"
                            className="form-control"
                            value={roomForm.maxOccupancy}
                            onChange={(e) => setRoomForm(prev => ({
                              ...prev,
                              maxOccupancy: parseInt(e.target.value)
                            }))}
                            required
                            min="1"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Food Option:</label>
                          <select
                            className="form-select"
                            value={roomForm.foodOption}
                            onChange={(e) => setRoomForm(prev => ({
                              ...prev,
                              foodOption: e.target.value
                            }))}
                            required
                          >
                            <option value="">Select food option</option>
                            <option value="Room Only">Room Only</option>
                            <option value="Breakfast Included">Breakfast Included</option>
                            <option value="All Meals Included">All Meals Included</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Amenities:</label>
                          <div className="mb-3">
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                className="form-control"
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                placeholder="Enter amenity"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddAmenity(e);
                                  }
                                }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleAddAmenity}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {roomForm.ammenities?.map((amenity, index) => (
                              <div key={index} className="badge bg-secondary d-flex align-items-center">
                                <span className="me-2">{amenity}</span>
                                <button
                                  type="button"
                                  className="btn-close btn-close-white"
                                  style={{ fontSize: '0.5rem' }}
                                  onClick={() => handleRemoveAmenity(amenity)}
                                  aria-label="Remove amenity"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="form-text text-muted">Add amenities one by one. Press Enter or click Add button to add an amenity.</div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-warning mt-4"
                        disabled={loading}
                      >
                        {loading ? 'Adding...' : 'Add Room'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Tickets Tab */}
            <div className={`tab-pane fade ${activeTab === 'tickets' ? 'show active' : ''}`}>
              <div className="bg-white rounded p-4">
                <h2 className="mb-4">Support Tickets</h2>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>User</th>
                        <th>Booking ID</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTickets.map(ticket => (
                        <tr key={ticket.ticketId}>
                          <td>{ticket.ticketId}</td>
                          <td>{ticket.userId}</td>
                          <td>{ticket.bookingId}</td>
                          <td>{ticket.issue}</td>
                          <td>
                            <span className={`badge bg-${ticket.status === 'RESOLVED' ? 'success' : ticket.status === 'IN_PROGRESS' ? 'warning' : ticket.status === 'CLOSED' ? 'secondary' : 'info'}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>{new Date(ticket.createdDate).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/agent/resolve-ticket/${ticket.ticketId}`)}
                              disabled={ticket.status === 'CLOSED'}
                            >
                              {ticket.status === 'CLOSED' ? 'Closed' : 'Resolve'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {supportTickets.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted">No support tickets found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HotelAgentDashboard;