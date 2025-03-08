import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import MenuPage from './pages/MenuPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductList from './Components/ProductList';
import ProductForm from './Components/ProductForm';
import ProductDetail from './Components/ProductDetail';
import PhotosPage from './pages/PhotosPage';
import PrivateRoute from './PrivateRoute';
import { useAuth } from './AuthContext';

const App = () => {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchProducts();  // Fetch products when token is available
    }
  }, [token]);

  // Function to fetch all products from the server
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);  // Set fetched products to state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out the deleted product from state immediately
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle saving a new or edited product
  const handleSave = async (newProduct) => {
    try {
      if (newProduct._id) {
        // If the product has an _id, update it
        await axios.put(`http://localhost:3002/api/products/${newProduct._id}`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update the product in the state immediately
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === newProduct._id ? newProduct : product
          )
        );
      } else {
        // If it's a new product, create it
        const response = await axios.post('http://localhost:3002/api/products', newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Add the new product to the state at the beginning of the list
        setProducts((prevProducts) => [response.data, ...prevProducts]);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Router>
      <div>
        <h1>Product & Photo Management</h1>
        <Routes>
          {/* Default route directs to RegisterPage */}
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu" element={<PrivateRoute element={<MenuPage />} />} />

          {/* Protected Menu & Info Pages */}
          <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/about" element={<PrivateRoute element={<AboutPage />} />} />

          {/* Protected CRUD Product Routes */}
          <Route
            path="/products"
            element={<PrivateRoute element={<ProductList products={products} onDelete={handleDelete} />} />}
          />
          <Route
            path="/product/new"
            element={<PrivateRoute element={<ProductForm onSave={handleSave} />} />}
          />
          <Route
            path="/product/edit/:id"
            element={<PrivateRoute element={<ProductForm onSave={handleSave} />} />}
          />
          <Route
            path="/product/details/:id"
            element={<PrivateRoute element={<ProductDetail />} />}
          />

          {/* Protected Photo Management */}
          <Route path="/photos" element={<PrivateRoute element={<PhotosPage />} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


