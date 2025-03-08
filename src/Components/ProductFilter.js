import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const ProductFilter = ({ setProducts }) => {
  const [searchId, setSearchId] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get(`/api/products/${searchId}`);
      setProducts([response.data]);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  return (
    <div>
      <h2>Filter Product by ID</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default ProductFilter;
