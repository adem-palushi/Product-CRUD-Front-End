import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './ProductDetail.css'; // Importing the updated CSS for styling

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  return (
    <div className="product-detail">
      <h2 className="product-title">{product.name}</h2>
      <div className="product-description">
        <p className="product-description-text">{product.description}</p>
      </div>
      <div className="product-details">
        <p><strong>Price:</strong> {product.price} {product.currency}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Status:</strong> {product.status}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
