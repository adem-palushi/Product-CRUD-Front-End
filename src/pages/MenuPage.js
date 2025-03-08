import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuPage.css'; // Importing the CSS file

const MenuPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="menu-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">App Menu</h1>
        <nav className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/photos" className="nav-link">Photos</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="welcome-container">
          <h2>Welcome to the Application!</h2>
          <p>Your one-stop solution for managing products, photos, and more! Explore the menu on the left to get started.</p>
        </div>

        <div className="feature-banner">
          <h3>Why Choose Us?</h3>
          <ul className="feature-list">
            <li>📷 Seamless photo management</li>
            <li>💼 Easy product tracking</li>
            <li>🚀 High performance and user-friendly interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
