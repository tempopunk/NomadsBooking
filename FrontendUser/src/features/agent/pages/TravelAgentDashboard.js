import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer';
import AgentHeader from '../../../components/AgentHeader';
import packageAgentApi from '../api/packageAgentApi';
import theme from '../../../theme';
import { Button } from 'react-bootstrap';

function TravelAgentDashboard() {
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('packages');
  const [supportTickets, setSupportTickets] = useState([]);
  const [packageForm, setPackageForm] = useState({
    origin: '',
    destination: '',
    numberOfDays: '',
    departureDate: '',
    price: '',
    hotelName: '',
    roomName: '',
    departureFlightId: '',
    returnFlightId: '',
    itineraryNotes: []
  });
  const [newItineraryNote, setNewItineraryNote] = useState('');
  const [formError, setFormError] = useState(null);
  const [showItineraryInput, setShowItineraryInput] = useState(false);
  const [itineraryError, setItineraryError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    try {
      const agentId = localStorage.getItem('userId');
      const tickets = await packageAgentApi.getAgentSupportTickets(agentId);
      setSupportTickets(tickets);
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
      setError('Failed to fetch support tickets');
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const agentId = localStorage.getItem('userId');
      const packageIds = await packageAgentApi.getPackageIds(agentId);
      
      // Fetch details for each package
      const packageDetailsPromises = packageIds.map(id => packageAgentApi.viewPackage(id));
      const packageDetails = await Promise.all(packageDetailsPromises);
      console.log('Fetched package details:', packageDetails); // Debugging line
      setPackages(packageDetails);
    } catch (err) {
      setError('Failed to fetch packages');
      console.error(err);
    }
    setLoading(false);
  };

  const handleViewBookings = async (packageId) => {
    try {
      const bookings = await packageAgentApi.viewPackageBookings(packageId);
      setBookings(bookings);
      console.log('Fetched bookings:', bookings); // Debugging line
      setSelectedPackageId(packageId);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    }
  };

  const validateDatesAndDays = () => {
    if (!packageForm.departureDate) {
      setItineraryError('Please enter departure date first');
      return false;
    }
    if (!packageForm.numberOfDays || packageForm.numberOfDays < 1) {
      setItineraryError('Please enter a valid number of days first');
      return false;
    }
    setItineraryError('');
    return true;
  };

  const handleAddItineraryNote = (e) => {
    e.preventDefault();
    if (!validateDatesAndDays()) {
      return;
    }

    if (packageForm.itineraryNotes.length >= packageForm.numberOfDays) {
      setItineraryError(`Cannot add more than ${packageForm.numberOfDays} itinerary notes`);
      return;
    }

    if (newItineraryNote.trim()) {
      const dayNumber = packageForm.itineraryNotes.length + 1;
      const date = new Date(packageForm.departureDate);
      date.setDate(date.getDate() + dayNumber - 1);
      const formattedDate = date.toISOString().split('T')[0];
      
      const formattedNote = `Day ${dayNumber} (${formattedDate}): ${newItineraryNote.trim()}`;
      
      setPackageForm(prev => ({
        ...prev,
        itineraryNotes: [...prev.itineraryNotes, formattedNote]
      }));
      setNewItineraryNote('');

      // Show/hide itinerary input based on number of notes
      if (packageForm.itineraryNotes.length + 1 >= packageForm.numberOfDays) {
        setShowItineraryInput(false);
      }
    }
  };

  // Update departure date handler
  const handleDepartureDateChange = (e) => {
    setPackageForm(prev => ({
      ...prev,
      departureDate: e.target.value,
      itineraryNotes: [] // Reset itinerary when date changes
    }));
    setShowItineraryInput(false);
    setItineraryError('');
  };

  // Update number of days handler
  const handleNumberOfDaysChange = (e) => {
    const days = parseInt(e.target.value);
    setPackageForm(prev => ({
      ...prev,
      numberOfDays: days,
      itineraryNotes: prev.itineraryNotes.slice(0, days) // Trim itinerary if days reduced
    }));
    setShowItineraryInput(days > 0);
    setItineraryError('');
  };

  const handleRemoveItineraryNote = (index) => {
    setPackageForm(prev => ({
      ...prev,
      itineraryNotes: prev.itineraryNotes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const formData = {
        ...packageForm,
        numberOfDays: parseInt(packageForm.numberOfDays),
        price: parseFloat(packageForm.price),
        departureFlightId: packageForm.departureFlightId ? parseInt(packageForm.departureFlightId) : null,
        returnFlightId: packageForm.returnFlightId ? parseInt(packageForm.returnFlightId) : null,
        itineraryNotes: packageForm.itineraryNotes
      };

      await packageAgentApi.addPackage(formData);
      setShowAddForm(false);
      setPackageForm({
        origin: '',
        destination: '',
        numberOfDays: '',
        departureDate: '',
        price: '',
        hotelName: '',
        roomName: '',
        departureFlightId: '',
        returnFlightId: '',
        itineraryNotes: []
      });
      fetchPackages(); // Refresh package list
    } catch (err) {
      setFormError(err.message || 'Failed to add package');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FDEFE1' 
      }}>
        <AgentHeader />
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

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
            Travel Package Management Dashboard
          </h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'packages' ? 'active' : ''}`}
                onClick={() => setActiveTab('packages')}
              >
                My Packages
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`}
                onClick={() => setActiveTab('tickets')}
              >
                My Tickets
              </button>
            </li>
          </ul>

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div>
              <button
                className="btn btn-primary mb-4"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : 'Add New Package'}
              </button>

              {showAddForm && (
                <form onSubmit={handleSubmitPackage} className="mb-4">
                  {formError && (
                    <div className="alert alert-danger">{formError}</div>
                  )}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Origin:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={packageForm.origin}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          origin: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Destination:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={packageForm.destination}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          destination: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Number of Days:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packageForm.numberOfDays}
                        onChange={handleNumberOfDaysChange}
                        required
                        min="1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Departure Date:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={packageForm.departureDate}
                        onChange={handleDepartureDateChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packageForm.price}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          price: e.target.value
                        }))}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Hotel Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={packageForm.hotelName}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          hotelName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Room Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={packageForm.roomName}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          roomName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Departure Flight ID:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packageForm.departureFlightId}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          departureFlightId: e.target.value
                        }))}
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Return Flight ID:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={packageForm.returnFlightId}
                        onChange={(e) => setPackageForm(prev => ({
                          ...prev,
                          returnFlightId: e.target.value
                        }))}
                        min="0"
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Itinerary Notes:</label>
                      {itineraryError && (
                        <div className="alert alert-danger">{itineraryError}</div>
                      )}
                      {showItineraryInput && packageForm.itineraryNotes.length < packageForm.numberOfDays && (
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={newItineraryNote}
                            onChange={(e) => setNewItineraryNote(e.target.value)}
                            placeholder={`Enter itinerary for Day ${packageForm.itineraryNotes.length + 1}`}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={handleAddItineraryNote}
                            disabled={loading}
                          >
                            Add
                          </button>
                        </div>
                      )}
                      {packageForm.itineraryNotes.length > 0 && (
                        <ul className="list-group mt-2">
                          {packageForm.itineraryNotes.map((note, index) => (
                            <li key={index} className="list-group-item">
                              {note}
                            </li>
                          ))}
                        </ul>
                      )}
                      {!showItineraryInput && packageForm.numberOfDays > 0 && packageForm.departureDate && (
                        <button
                          type="button"
                          className="btn btn-secondary mt-2"
                          onClick={() => setShowItineraryInput(true)}
                        >
                          Add Itinerary Notes
                        </button>
                      )}
                      {packageForm.itineraryNotes.length === parseInt(packageForm.numberOfDays) && (
                        <div className="alert alert-success mt-2">
                          All itinerary notes added for {packageForm.numberOfDays} days!
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-4"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Package'}
                  </button>
                </form>
              )}

              <div className="bg-white rounded p-4 mb-4">
                <h2 className="mb-4">Your Packages</h2>
                <div className="row g-4">
                  {packages.map(pkg => (
                    <div key={pkg.packageId} className="col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{pkg.name}</h5>
                          <p className="card-text">
                            <strong>Origin:</strong> {pkg.origin}<br/>
                            <strong>Destination:</strong> {pkg.destination}<br/>
                            <strong>Departure Date</strong> {pkg.departureDate}<br/>
                            <strong>No of Days:</strong> {pkg.numberOfDays}<br/>
                            <strong>Price:</strong> ₹{pkg.price}
                          </p>
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => handleViewBookings(pkg.packageId)}
                          >
                            View Bookings
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {packages.length === 0 && (
                    <div className="col-12">
                      <div className="alert alert-info">No packages available.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bookings Section */}
              {selectedPackageId && (
                <div className="bg-white rounded p-4">
                  <h2 className="mb-4">Package Bookings</h2>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>User Id</th>
                          <th>Booking Date</th>
                      
                          <th>Total Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.userId}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            
                            <td>₹{booking.totalAmount}</td>
                            <td>
                              <span className={`badge bg-${booking.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {bookings.length === 0 && (
                      <div className="alert alert-info">No bookings found for this package.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TravelAgentDashboard;