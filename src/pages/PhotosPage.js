import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PhotosPage.css'; // Import the corresponding CSS
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState(''); // For capturing the photo title
  const [selectedFile, setSelectedFile] = useState(null); // For capturing the photo file

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Fetch photos from the backend
  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/photos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Error fetching photos');
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload photo to the backend
  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast.error('Please provide a title and select a photo');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', selectedFile);

    try {
      await axios.post('http://localhost:3002/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTitle(''); // Reset title field
      setSelectedFile(null); // Reset file input
      fetchPhotos(); // Refresh photo list
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error uploading photo');
    }
  };

  // Delete a photo by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/photos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchPhotos(); // Refresh photo list after deletion
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Error deleting photo');
    }
  };

  return (
    <div className="photos-page">
      <div className="content">
        <h1>Manage Photos</h1>
        <div className="photo-controls">
          <input
            type="text"
            placeholder="Enter photo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Capture title input
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload Photo</button>
        </div>
        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo._id} className="photo-card">
              <img src={photo.image} alt="Uploaded" />
              <button
                onClick={() => handleDelete(photo._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer /> {/* Add this container to show notifications */}
    </div>
  );
};

export default PhotosPage;
