import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/authentication/context/AuthContext';
import PrivateRoute from './features/authentication/components/PrivateRoute';
 
// Import all our components
import Home from './features/authentication/pages/Home.js';
import LoginUser from './features/authentication/pages/LoginUser.js';
import RegisterUser from './features/authentication/pages/RegisterUser.js';
import LoginAgent from './features/agent/pages/LoginAgent.js';
import RegisterAgent from './features/agent/pages/RegisterAgent.js';
import HotelAgentDashboard from './features/agent/pages/HotelAgentDashboard.js';
import FlightAgentDashboard from './features/agent/pages/FlightAgentDashboard.js';
import TravelAgentDashboard from './features/agent/pages/TravelAgentDashboard.js';
import HotelList from './features/hotelandflightbooking/pages/HotelList.js';
import ViewHotel from './features/hotelandflightbooking/pages/ViewHotel.js';
import ViewRoom from './features/hotelandflightbooking/pages/ViewRoom.js';
import PaymentMethodSelection from './features/payments/pages/PaymentMethodSelection.js';
import CardPaymentForm from './features/payments/pages/CardPaymentForm';
import UpiPaymentForm from './features/payments/pages/UpiPaymentForm';
import NetBankingPaymentForm from './features/payments/pages/NetBankingPaymentForm';
import PaymentSuccess from './features/payments/pages/PaymentSuccess';
import PaymentList from './features/payments/pages/PaymentList';
import Booking from './features/bookings/pages/Booking';
import PackageList from './features/travelpackage/pages/PackageList';
import ViewPackage from './features/travelpackage/pages/ViewPackage';
import FlightList from './features/hotelandflightbooking/pages/FlightList';
import ViewFlight from './features/hotelandflightbooking/pages/ViewFlight';
import SupportPage from './features/reviews/pages/SupportPage';
import SupportTrackerPage from './features/reviews/pages/SupportTrackerPage';
import SupportTicketDetailPage from './features/reviews/pages/SupportTicketDetailPage';
import ResolveTicketPage from './features/reviews/pages/ResolveTicketPage';
import Profile from './features/authentication/pages/Profile.js';
import AgentProfile from './features/agent/pages/AgentProfile.js';

function App() {
  return (
    // Wrap the entire application with BrowserRouter for routing
<Router>
      {/* Wrap the entire application with AuthProvider to make auth context available everywhere */}
<AuthProvider>
        {/* Define application routes */}
<Routes>
  <Route path="/" element={<LoginUser />} />
  <Route path="/login" element={<LoginUser />} />
  <Route path="/register/user" element={<RegisterUser />} />
  <Route path="/agent/login" element={<LoginAgent />} />
  <Route path="/agent/register" element={<RegisterAgent />} />
  <Route path="/profile" element={
<PrivateRoute>
<Profile />
</PrivateRoute>
} />
<Route path="/home" element={
<PrivateRoute>
<Home />
</PrivateRoute>
} />
<Route path="/hotels" element={
<PrivateRoute>
<HotelList />
</PrivateRoute>
} />
<Route path="/hotels/:hotelId" element={
<PrivateRoute>
<ViewHotel />
</PrivateRoute>
} />
<Route path="/rooms/:roomId" element={
<PrivateRoute>
<ViewRoom />
</PrivateRoute>
} />
<Route path="/payment/select" element={
<PrivateRoute>
<PaymentMethodSelection />
</PrivateRoute>
} />
<Route path="/payment/card" element={
<PrivateRoute>
<CardPaymentForm />
</PrivateRoute>
} />
<Route path="/payment/upi" element={
<PrivateRoute>
<UpiPaymentForm />
</PrivateRoute>
} />
<Route path="/payment/netbanking" element={
<PrivateRoute>
<NetBankingPaymentForm />
</PrivateRoute>
} />
<Route path="/payment/success" element={
<PrivateRoute>
<PaymentSuccess />
</PrivateRoute>
} />
<Route path="/mypayments" element={
<PrivateRoute>
<PaymentList />
</PrivateRoute>
} />
<Route path="/bookings" element={
<PrivateRoute>
<Booking />
</PrivateRoute>
} />
<Route path="/packages" element={<PackageList />} />
<Route path="/packages/:packageId" element={<ViewPackage />} />
<Route path="/flights" element={
<PrivateRoute>
<FlightList />
</PrivateRoute>
} />
<Route path="/flights/:flightId" element={
<PrivateRoute>
<ViewFlight />
</PrivateRoute>
} />
<Route path="/support/:bookingId" element={
  <PrivateRoute>
    <SupportPage />
  </PrivateRoute>
} />
<Route path="/support" element={
  <PrivateRoute>
    <SupportTrackerPage />
  </PrivateRoute>
} />
<Route path="/support/details/:ticketId" element={
  <PrivateRoute>
    <SupportTicketDetailPage />
  </PrivateRoute>
} />
<Route path="/agent/resolve-ticket/:ticketId" element={
          <PrivateRoute>
            <ResolveTicketPage />
          </PrivateRoute>
        } />

          {/* Agent Routes */}
          <Route path="/agent/login" element={<LoginAgent />} />
          <Route path="/agent/register" element={<RegisterAgent />} />
          <Route path="/agent/profile" element={
            <PrivateRoute>
              <AgentProfile />
            </PrivateRoute>
          } />
          <Route path="/agent/hotel-dashboard" element={
            <PrivateRoute>
              <HotelAgentDashboard />
            </PrivateRoute>
          } />
          <Route path="/agent/flight-dashboard" element={
            <PrivateRoute>
              <FlightAgentDashboard />
            </PrivateRoute>
          } />
          <Route path="/agent/travel-dashboard" element={
            <PrivateRoute>
              <TravelAgentDashboard />
            </PrivateRoute>
          } />

          {/* Fallback for undefined routes */}
<Route path="*" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>404 - Page Not Found</h1>} />
</Routes>
</AuthProvider>
</Router>
  );
}
 
export default App;