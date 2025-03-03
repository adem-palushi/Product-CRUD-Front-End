import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './Components/ProductList';
import ProductForm from './Components/ProductForm';
import ProductDetail from './Components/ProductDetail';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id)); // Update the list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSave = (newProduct) => {
    if (newProduct._id) {
      // Update the existing product
      setProducts(products.map(p => (p._id === newProduct._id ? newProduct : p)));
    } else {
      // Add the new product to the list
      setProducts([...products, newProduct]);
    }
    fetchProducts(); // Refresh the list after saving the product
  };

  return (
    <Router>
      <div>
        <h1>Product Management</h1>
        <Routes>
          <Route path="/" element={<ProductList products={products} onDelete={handleDelete} />} />
          <Route path="/product/new" element={<ProductForm onSave={handleSave} fetchProducts={fetchProducts} />} />
          <Route path="/product/edit/:id" element={<ProductForm onSave={handleSave} fetchProducts={fetchProducts} />} />
          <Route path="/product/details/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
