import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import theme from '../../../theme';
import AgentHeader from '../../../components/AgentHeader';
import Footer from '../../../components/Footer';
import flightAgentApi from '../api/flightAgentApi';

function FlightAgentDashboard() {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('flights');
  const navigate = useNavigate();

  // Form state for flight
  const [flightForm, setFlightForm] = useState({
    companyName: '',
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
    price: ''
  });

  useEffect(() => {
    fetchFlights();
    fetchSupportTickets();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const agentId = localStorage.getItem('userId');
      // Get flight IDs for this agent
      const flightIds = await flightAgentApi.getFlightIds(agentId);
      
      // Get details for each flight
      const flightPromises = flightIds.map(id => flightAgentApi.getFlightDetails(id));
      const flights = await Promise.all(flightPromises);
      setFlights(flights);
    } catch (err) {
      console.error('Failed to fetch flights:', err);
      setError('Failed to fetch flights');
    }
    setLoading(false);
  };

  const fetchSupportTickets = async () => {
    try {
      const agentId = localStorage.getItem('userId');
      const tickets = await flightAgentApi.getAgentSupportTickets(agentId);
      setSupportTickets(tickets);
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
      setError('Failed to fetch support tickets');
    }
  };

  const handleViewBookings = async (flightId) => {
    setLoading(true);
    try {
      const bookings = await flightAgentApi.getFlightBookings(flightId);
      setBookings(bookings || []);
      setSelectedFlightId(flightId);
    } catch (err) {
      setError('Failed to fetch flight bookings');
    }
    setLoading(false);
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const agentId = localStorage.getItem('userId');
      await flightAgentApi.addFlight(agentId, flightForm);
      
      // Reset form and hide it
      setFlightForm({
        companyName: '',
        origin: '',
        destination: '',
        departureDate: '',
        departureTime: '',
        arrivalTime: '',
        price: ''
      });
      setShowAddForm(false);
      
      // Refresh flights list
      await fetchFlights();
    } catch (err) {
      setError(err.message || 'Failed to add flight');
    }
    setLoading(false);
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
            Flight Management Dashboard
          </h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'flights' ? 'active' : ''}`}
                onClick={() => setActiveTab('flights')}
              >
                My Flights
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

          {/* Add Flight and Flights List Sections */}
          {activeTab === 'flights' && (
            <>
              {/* Add Flight Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 style={{ color: '#000000' }}>Flight Management</h2>
                  <Button 
                    variant="primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    {showAddForm ? 'Cancel' : 'Add New Flight'}
                  </Button>
                </div>

                {showAddForm && (
                  <Form onSubmit={handleFlightSubmit} className="mb-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={flightForm.companyName}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              companyName: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Origin</Form.Label>
                          <Form.Control
                            type="text"
                            value={flightForm.origin}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              origin: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Destination</Form.Label>
                          <Form.Control
                            type="text"
                            value={flightForm.destination}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              destination: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Departure Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={flightForm.departureDate}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              departureDate: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Departure Time</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={flightForm.departureTime}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              departureTime: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Arrival Time</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={flightForm.arrivalTime}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              arrivalTime: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            value={flightForm.price}
                            onChange={(e) => setFlightForm(prev => ({
                              ...prev,
                              price: e.target.value
                            }))}
                            required
                            min="0"
                            step="0.01"
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      type="submit"
                      className="mt-4"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Flight'}
                    </Button>
                  </Form>
                )}
              </div>

              {/* Flights List Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                <h2 style={{ marginBottom: theme.spacing.lg, color: '#000000' }}>Your Flights</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Flight ID</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Company Name</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Origin</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Destination</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Departure Date</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Departure Time</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Arrival Time</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Price</th>
                        <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights.map(flight => (
                        <tr key={flight.flightId}>
                          <td style={{ padding: theme.spacing.md }}>{flight.flightId}</td>
                          <td style={{ padding: theme.spacing.md }}>{flight.companyName}</td>
                          <td style={{ padding: theme.spacing.md }}>{flight.origin}</td>
                          <td style={{ padding: theme.spacing.md }}>{flight.destination}</td>
                          <td style={{ padding: theme.spacing.md }}>{new Date(flight.departureDate).toLocaleDateString()}</td>
                          <td style={{ padding: theme.spacing.md }}>{new Date(flight.departureTime).toLocaleString()}</td>
                          <td style={{ padding: theme.spacing.md }}>{new Date(flight.arrivalTime).toLocaleString()}</td>
                          <td style={{ padding: theme.spacing.md }}>₹{flight.price}</td>
                          <td style={{ padding: theme.spacing.md }}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleViewBookings(flight.flightId)}
                            >
                              View Bookings
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {flights.length === 0 && (
                    <p className="text-center py-4 text-muted">No flights found.</p>
                  )}
                </div>
              </div>

              {/* Bookings Section */}
              {selectedFlightId && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.xl
                }}>
                  <h2 style={{ marginBottom: theme.spacing.lg, color: '#000000' }}>
                    Flight Bookings
                    {flights.find(f => f.id === selectedFlightId)?.flightNumber && 
                      ` - ${flights.find(f => f.id === selectedFlightId).flightNumber}`
                    }
                  </h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Booking ID</th>
                          <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>User ID</th>
                          
                          <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Booking Date</th>
                          <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Amount</th>
                          <th style={{ padding: theme.spacing.md, textAlign: 'left' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <tr key={booking.bookingId}>
                            <td style={{ padding: theme.spacing.md }}>{booking.bookingId}</td>
                            <td style={{ padding: theme.spacing.md }}>{booking.userId}</td>
                            
                            <td style={{ padding: theme.spacing.md }}>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td style={{ padding: theme.spacing.md }}>₹{booking.totalAmount}</td>
                            <td style={{ padding: theme.spacing.md }}>
                              <span className={`badge bg-${booking.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {bookings.length === 0 && (
                      <p className="text-center py-4 text-muted">No bookings found for this flight.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded p-4">
              <h2 className="mb-4" style={{ color: '#000000' }}>Support Tickets</h2>
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

export default FlightAgentDashboard;