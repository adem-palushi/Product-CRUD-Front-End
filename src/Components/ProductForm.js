import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = ({ onSave, fetchProducts }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    currency: '',
    stock: '',
    category: '',
    sku: '',
    brand: '',
    status: ''
  });

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        response = await axios.put(`http://localhost:3001/api/products/${id}`, product);
      } else {
        response = await axios.post('http://localhost:3001/api/products', product);
      }
      onSave(response.data); // Update the local state in App.js
      fetchProducts(); // Refresh the product list in App.js
      navigate('/'); // Redirect to the product list page
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
        <input type="text" name="currency" placeholder="Currency" value={product.currency} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={product.stock} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
        <input type="text" name="sku" placeholder="SKU" value={product.sku} onChange={handleChange} required />
        <input type="text" name="brand" placeholder="Brand" value={product.brand} onChange={handleChange} required />
        <input type="text" name="status" placeholder="Status" value={product.status} onChange={handleChange} required />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProductForm;
