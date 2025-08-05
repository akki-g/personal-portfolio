import { useEffect } from 'react';
import './About.css';
import Experiences from '../components/features/Experiences';
import ChatBox from '../components/features/ChatBox';
import useImages from '../hooks/useImages';

/**
 * About page component that displays personal information, experiences, and chat functionality
 */
const About = () => {
  const { images, loading, error } = useImages();

  // Scroll to top when component mounts and when images load
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    
    // Additional scroll after a short delay to override any competing scroll behaviors
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Also scroll to top when images finish loading (in case image loading changes layout)
  useEffect(() => {
    if (!loading && images) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    }
  }, [loading, images]);

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
        {/* Hero Introduction Section */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-content">
            <h1 id="hero-heading" className="hero-heading">
              <div className="hero-line">
                <span className="hero-text">Nice to</span>
                {images.image_1 && (
                  <div className="hero-image-wrapper">
                    <img
                      src={images.image_1}
                      alt="Decorative element"
                      className="hero-image"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
              <div className="hero-line">
                {images.image_2 && (
                  <div className="hero-image-wrapper">
                    <img
                      src={images.image_2}
                      alt="Decorative element"
                      className="hero-image"
                      loading="lazy"
                    />
                  </div>
                )}
                <span className="hero-text">Meet You</span>
              </div>
              <div className="hero-line hero-highlight">
                <span className="hero-text">I&apos;m Akshat</span>
                {images.image_3 && (
                  <div className="hero-image-wrapper">
                    <img
                      src={images.image_3}
                      alt="Profile picture"
                      className="hero-image"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </h1>
            <p className="hero-subtitle">Researcher & Engineer</p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="content-section" aria-label="Personal Information">
          <div className="content-grid">
            {/* Left Column - Personal Info Cards */}
            <aside className="info-column" role="complementary">
              <article className="info-card about-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2>About Me</h2>
                <p>
                  Honors dual-major in Computer Science and Statistics, with a minor in Math, at the University of Central Florida (Class of 2027) with expertise in full-stack development and AI-driven solutions.
                  Current researcher with 'Autonomus Systems and Robotics Lab' at UCF, MARL and communication efficient algorithms.
                </p>
              </article>
              
              <article className="info-card role-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2>Current Role</h2>
                <p className="role-title">Machine Learning Researcher</p>
                <p className="role-subtitle">
                  Seeking SDE Intern, ML/RL Research Intern, or Full Stack Developer roles.

                  </p>
              </article>
              
              <article className="info-card contact-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2>Connect With Me</h2>
                <ul className="contact-list">
                  <li>
                    <a href="https://github.com/akki-g" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                      <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.216.682-.48 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                      @akki-g
                    </a>
                  </li>
                  <li>
                    <a href="mailto:akshat.guduru@gmail.com" aria-label="Email">
                      <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <path d="M22 6l-10 7L2 6"/>
                      </svg>
                      Email Me
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/akshat-guduru-72b888290" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                      <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  </li>
                </ul>
              </article>
            </aside>

            {/* Right Column - Experiences */}
            <main className="experience-column">
              <Experiences />
            </main>
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