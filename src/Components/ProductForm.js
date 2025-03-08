import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './ProductForm.css'; // Import the new CSS

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
    status: '',
    image: null,
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const response = await axiosInstance.get(`/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('currency', product.currency);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    formData.append('sku', product.sku);
    formData.append('brand', product.brand);
    formData.append('status', product.status);
    if (image) {
      formData.append('image', image);
    }

    try {
      let response;
      if (id) {
        response = await axiosInstance.put(`/api/products/${id}`, formData);
      } else {
        response = await axiosInstance.post('/api/products', formData);
      }
      onSave(response.data);
      fetchProducts();
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{id ? 'Edit Product' : 'Create New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          type="text"
          name="currency"
          value={product.currency}
          onChange={handleChange}
          placeholder="Currency"
        />
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <input
          type="text"
          name="sku"
          value={product.sku}
          onChange={handleChange}
          placeholder="SKU"
        />
        <input
          type="text"
          name="brand"
          value={product.brand}
          onChange={handleChange}
          placeholder="Brand"
        />
        <input
          type="text"
          name="status"
          value={product.status}
          onChange={handleChange}
          placeholder="Status"
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">{id ? 'Update Product' : 'Create Product'}</button>
      </form>
    </div>
  );
};

export default ProductForm;
