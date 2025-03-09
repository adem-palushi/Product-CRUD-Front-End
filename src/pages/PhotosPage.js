import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './PhotosPage.css'; // Import the corresponding CSS
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBell } from 'react-icons/fa';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [notifications, setNotifications] = useState([]); // Store notifications
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [hasNewNotification, setHasNewNotification] = useState(false); // Track if there's a new notification

  const popupRef = useRef(null); // Reference for the popup
  const bellRef = useRef(null); // Reference for the bell icon

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    // Event listener to close the popup when clicked outside
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPopup]);

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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

      setTitle('');
      setSelectedFile(null);
      fetchPhotos();

      // After upload, trigger notification (but don't show message immediately)
      setNotifications((prev) => [
        ...prev,
        { id: new Date().getTime(), message: 'New photo uploaded successfully' },
      ]);
      setHasNewNotification(true); // Show red dot on bell
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error uploading photo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/photos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchPhotos();
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Error deleting photo');
    }
  };

  const handleBellClick = () => {
    setShowPopup((prev) => !prev); // Toggle the visibility of the notification popup
    if (hasNewNotification) {
      setHasNewNotification(false); // Remove red dot when clicking on bell
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
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

      {/* Notification Bell */}
      <div className="notification-container" onClick={handleBellClick} ref={bellRef}>
        <FaBell className={`bell-icon ${hasNewNotification ? 'new-notification' : ''}`} />
      </div>

    {/* Notification Popup */}
{showPopup && (
  <div className="notifications-popup" ref={popupRef}>
    {notifications.length > 0 ? (
      notifications.map((notification) => (
        <div key={notification.id} className="notification-item">
          <span>{notification.message}</span>
          <button 
            className="delete-notification"
            onClick={() => handleDeleteNotification(notification.id)}
          >
            &times;
          </button>
        </div>
      ))
    ) : (
      <div className="notification-item">No new notifications</div>
    )}
  </div>
)}
      <ToastContainer />
    </div>
  );
};

export default PhotosPage;
