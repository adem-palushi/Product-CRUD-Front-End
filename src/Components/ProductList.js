import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?search=${search}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products when the component mounts or search term changes
  useEffect(() => {
    fetchProducts();
  }, [search]);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
        },
      });

      if (response.ok) {
        // Remove the deleted product from the list in state
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      } else {
        console.error('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      
      <Link to="/product/new" className="create-link">
        Create New Product
      </Link>
      
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
            {/* <th>Image</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <Link to={`/product/details/${product._id}`} className="product-link">
                  {product.name}
                </Link>
              </td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.currency}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>{product.sku}</td>
              <td>{product.brand}</td>
              <td>{product.status}</td>
              {/* <td>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <span>No Image</span>
                )}
              </td> */}
              <td>
                <button onClick={() => navigate(`/product/edit/${product._id}`)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
