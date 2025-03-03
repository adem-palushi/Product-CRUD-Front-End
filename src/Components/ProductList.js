import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <Link to="/product/new" className="create-link">Create New Product</Link>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Currency</th>
            <th>Stock</th>
            <th>Category</th>
            <th>SKU</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <Link to={`/product/details/${product._id}`} className="product-link">{product.name}</Link>
              </td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.currency}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>{product.sku}</td>
              <td>{product.brand}</td>
              <td>{product.status}</td>
              <td>
                <button onClick={() => navigate(`/product/edit/${product._id}`)} className="edit-button">Edit</button>
                <button onClick={() => onDelete(product._id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
