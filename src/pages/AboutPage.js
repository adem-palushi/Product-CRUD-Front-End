import React from 'react';
import './AboutPage.css'; // Import external CSS styles

// Functional Component for AboutPage
const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="overlay">
        <h1>About This Application</h1>
        <p>
          This application empowers photographers to efficiently manage their products and photos.
        </p>
        <p>
          Designed and built using modern technologies: <strong>React.js</strong>, <strong>Node.js</strong>, and custom <strong>CSS</strong>.
        </p>
      </div>
    </div>
  );
};

// Exporting the Component
export default AboutPage;
