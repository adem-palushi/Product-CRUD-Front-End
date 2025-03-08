import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css'; // Importing the CSS file

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/api/auth/register', formData);
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="auth-input"
            required
          />
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
            Register
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <a href="/login" className="auth-link">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
