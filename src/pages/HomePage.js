import React from 'react';
import './HomePage.css'; // Import the CSS file

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="overlay">
        <h1>Welcome to Our Application</h1>
        <p>Manage your products and photos easily.</p>
        <div className="contact-info">
          <p>Email: support@gmail.com</p>
          <p>Phone: +355 456 7890</p>
          <p>Instagram: support@gmail.com</p>
          <p>Facebook: support@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
