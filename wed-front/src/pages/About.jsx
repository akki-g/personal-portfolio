import React from 'react';
import './About.css';
import Experiences from '../components/features/Experiences';
import ChatBox from '../components/features/ChatBox';
import useImages from '../hooks/useImages';

/**
 * About page component that displays personal information, experiences, and chat functionality
 */
const About = () => {
  const { images, loading, error } = useImages();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading content. Please try again later.</p>
      </div>
    );
  }

  return (
    <main>
      <div className="about-container">
        {/* Introduction Section */}
        <section className="about-intro">
          <div className="about-intro-text">
            <div className="intro-1">
              <span>
                Nice to
                {images.image_1 && (
                  <img
                    src={images.image_1}
                    alt="Image for Nice to"
                    className="intro-image"
                  />
                )}
              </span>
            </div>
            <div className="intro-2">
              <span>
                {images.image_2 && (
                  <img
                    src={images.image_2}
                    alt="Image for Meet You"
                    className="intro-image"
                  />
                )}
                Meet You
              </span>
            </div>
            <div className="intro-3">
              <span>
                I'm Akshat
                {images.image_3 && (
                  <img
                    src={images.image_3}
                    alt="Image for I'm Akshat"
                    className="intro-image"
                  />
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="content">
          {/* Left Column - Personal Info */}
          <div className="left-column">
            <div className="info-block about">
              <h2>About</h2>
              <p>
                Computer Science Student from the University of Central Florida
                <br />
                I love machine learning and AI.
              </p>
            </div>
            
            <div className="info-block role">
              <h2>Role</h2>
              <p>
                Machine Learning Researcher
                <br />
                Prospective SDE Intern
              </p>
            </div>
            
            <div className="info-block contact">
              <h2>Contact</h2>
              <p>Git: @akki-g</p>
              <p>Mail: akshat.guduru@gmail.com</p>
              <p>Instagram: @akshatguduru</p>
            </div>
          </div>

          {/* Right Column - Experiences */}
          <div className="right-column">
            <Experiences />
          </div>
        </section>

        {/* Chat Section */}
        <section className="chatbox-section">
          <ChatBox />
        </section>
      </div>
    </main>
  );
};

export default About;