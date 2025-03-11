import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './PhotosPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBell } from 'react-icons/fa';
import io from 'socket.io-client';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // Control popup visibility
  const [hasNewNotification, setHasNewNotification] = useState(false); // Track if there's a new notification
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notification count
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Track the photo to display in the modal

  const popupRef = useRef(null);
  const bellRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    fetchPhotos();

    // Initialize socket connection
    socket.current = io('http://localhost:3002'); 

    // Listen for notifications from the server
    socket.current.on('newNotification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
      setHasNewNotification(true);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside of the bell icon or popup
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowPopup(false); // Close the popup if clicked outside
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
      const response = await axios.post('http://localhost:3002/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTitle('');
      setSelectedFile(null);
      fetchPhotos();

      const notification = {
        id: new Date().getTime(),
        photoId: response.data._id, // ID of the uploaded photo
        message: `New photo "${title}" uploaded successfully`,
        seen: false,
      };

      socket.current.emit('sendNotification', notification);

      setHasNewNotification(true);
    //   setUnreadCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error uploading photo');
    }
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, seen: true } : n
      )
    );

    if (!notification.seen) {
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    }

    const relatedPhoto = photos.find((photo) => photo._id === notification.photoId);
    if (relatedPhoto) {
      setSelectedPhoto(relatedPhoto);
    } else {
      toast.error('Photo not found for this notification.');
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

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => {
      const notificationToDelete = prev.find((n) => n.id === id);
      if (notificationToDelete && !notificationToDelete.seen) {
        setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
      }
      return prev.filter((notification) => notification.id !== id);
    });
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
            onChange={(e) => setTitle(e.target.value)}
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
      <div className="notification-container" onClick={() => setShowPopup((prev) => !prev)} ref={bellRef}>
        <FaBell className={`bell-icon ${hasNewNotification ? 'new-notification' : ''}`} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {/* Notification Popup */}
      {showPopup && (
        <div className="notifications-popup" ref={popupRef}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.seen ? 'seen' : 'unseen'}`}
              >
                <span onClick={() => handleNotificationClick(notification)}>{notification.message}</span>
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

      {/* Modal to display selected photo */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            <h2>{selectedPhoto.title}</h2>
            <button onClick={() => setSelectedPhoto(null)}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PhotosPage;
