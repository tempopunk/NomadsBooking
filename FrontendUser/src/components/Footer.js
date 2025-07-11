import React from 'react';
import { Link } from 'react-router-dom';
 
const Footer = () => {
  return (
    <footer className="bg-white text-center text-lg-start shadow-sm">
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold" style={{ color: '#34495E' }}>
              Nomads Booking
            </h5>
            <p>
              Explore the world with ease. Book flights, hotels, and more with
              Nomads Booking. Your travel companion for a seamless experience.
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/" className="text-dark text-decoration-none">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register/user" className="text-dark text-decoration-none">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact Us</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <p className="text-dark mb-0">Email: support@nomadsbooking.com</p>
              </li>
              <li>
                <p className="text-dark mb-0">Phone: +1 234 567 890</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-3" style={{ backgroundColor: '#F39C12', color: '#FFFFFF' }}>
        © 2025 Nomads Booking. All rights reserved.
      </div>
    </footer>
  );
};
 
export default Footer;