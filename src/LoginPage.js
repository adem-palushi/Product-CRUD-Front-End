import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AuthPage.css'; // Importing the CSS file

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from context

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/auth/login', formData);
      login(response.data.token); // Use the login function to store the token
      navigate('/menu');  // Redirect to products page
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <a href="/register" className="auth-link">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
