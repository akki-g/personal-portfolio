import { useEffect, useState } from "react";
import './Home.css';
import apiClient from './AxiosInstance';
import ProjectBox from '../components/features/ProjectBox';

/**
 * Home page component that displays the hero section, projects, and contact links
 */
function Home() {
    const [projects, setProjects] = useState([]);  
    const [resume, setResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Scroll to projects section
    const scrollToProjects = () => {
        const projectsSection = document.querySelector('.projects-section');
        projectsSection?.scrollIntoView({ behavior: 'smooth' });
    };

    // Enhanced dynamic background based on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.8;
            const opacity = Math.max(0.4, 1 - scrolled / 800);
            
            // Update background elements with more pronounced effects
            const orbs = document.querySelectorAll('.hero-gradient-orb');
            const mesh = document.querySelector('.hero-mesh-pattern');
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                const rotation = scrolled * 0.2;
                const scale = 1 + (scrolled * 0.001);
                
                orb.style.transform = `translateY(${rate * speed}px) rotate(${rotation}deg) scale(${scale})`;
                orb.style.opacity = opacity;
            });
            
            if (mesh) {
                const meshScale = 1 + scrolled * 0.002;
                const meshRotation = scrolled * 0.1;
                mesh.style.transform = `scale(${meshScale}) rotate(${meshRotation}deg)`;
                mesh.style.opacity = opacity * 0.9;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Fetch projects data
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('projects/');
                setProjects(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Failed to load projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        // Fetch resume for download
        const fetchResume = async () => {
            try {
                const response = await apiClient.get('download-resume',  {
                    responseType: 'blob'
                });
                const url = URL.createObjectURL(new Blob([response.data]));
                setResume(url);
            } catch (error) {
                console.error('Error fetching resume:', error);
                // We don't set the main error state here since it's not critical
            }
        };

        fetchResume();

        // Clean up the object URL on unmount
        return () => {
            if (resume) {
                URL.revokeObjectURL(resume);
            }
        };
    }, [resume]);

    // Loading state
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading content...</p>
            </div>
        );
    }

    return (
        <main>
            <div className="home-container">
                {/* Enhanced Hero Section */}
                <section className="hero-section" aria-labelledby="hero-heading">
                    <div className="hero-background">
                        <div className="hero-gradient-orb orb-1"></div>
                        <div className="hero-gradient-orb orb-2"></div>
                        <div className="hero-gradient-orb orb-3"></div>
                        <div className="hero-mesh-pattern"></div>
                    </div>
                    
                    <div className="hero-content">
                        <div className="hero-greeting">
                            <span className="greeting-text">👋 Hello, I&apos;m</span>
                        </div>
                        
                        <h1 id="hero-heading" className="hero-title">
                            <div className="title-line">
                                <span className="title-word" data-word="AKSHAT">AKSHAT</span>
                            </div>
                            <div className="title-line">
                                <span className="title-word gradient-text" data-word="GUDURU">GUDURU</span>
                            </div>
                        </h1>
                        
                        <div className="hero-subtitle">
                            <p className="subtitle-line">Student & Researcher</p>
                            <p className="subtitle-line">Computer Science & Statistics</p>
                            <p className="subtitle-line">Machine Learning Enthusiast</p>
                        </div>
                        
                        <div className="hero-cta">
                            <button className="cta-button primary" onClick={scrollToProjects}>
                                <span>Explore My Work</span>
                                <svg className="cta-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {resume && (
                                <a 
                                    href={resume} 
                                    download="AkshatGuduru_Resume.pdf"
                                    className="cta-button secondary"
                                    aria-label="Download Resume"
                                >
                                    <span>Download Resume</span>
                                    <svg className="cta-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section className="projects-section" aria-labelledby="projects-heading">
                    <div className="section-header">
                        <div className="section-intro">
                            <span className="section-icon">💻</span>
                            <span className="section-subtitle">Featured Portfolio</span>
                        </div>
                        <h2 id="projects-heading" className="section-title">My Latest Projects</h2>
                        <p className="section-description">
                            A collection of my recent work in machine learning, web development, and software engineering
                        </p>
                    </div>
                    
                    {/* Scrolling Header */}
                    <div className="scrolling-section-header">
                        <div className="scrolling-header">
                            <span>Check Out My Projects</span><span role="img" aria-label="rocket">🚀</span>
                            <span>Machine Learning & AI</span><span role="img" aria-label="brain">🧠</span>
                            <span>Web Development</span><span role="img" aria-label="computer">💻</span>
                            <span>Software Engineering</span><span role="img" aria-label="gear">⚙️</span>
                            <span>Check Out My Projects</span><span role="img" aria-label="rocket">🚀</span>
                            <span>Machine Learning & AI</span><span role="img" aria-label="brain">🧠</span>
                            <span>Web Development</span><span role="img" aria-label="computer">💻</span>
                            <span>Software Engineering</span><span role="img" aria-label="gear">⚙️</span>
                        </div>
                    </div>

                    {error ? (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <h3>Unable to load projects</h3>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {projects.map((project, index) => (
                                <article 
                                    key={project.id} 
                                    className={`project-item ${
                                        projects.length % 2 !== 0 && index === projects.length - 1 
                                            ? 'full-width' 
                                            : ''
                                    }`}
                                >
                                    <ProjectBox project={project} />
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Contact Section */}
                <section className="contact-section" aria-labelledby="contact-heading">
                    <div className="section-header">
                        <div className="section-intro">
                            <span className="section-icon">🤝</span>
                            <span className="section-subtitle">Let&apos;s Connect</span>
                        </div>
                        <h2 id="contact-heading" className="section-title">Work With Me</h2>
                        <p className="section-description">
                            Interested in collaboration or have a project in mind? I&apos;d love to hear from you!
                        </p>
                    </div>
                    
                    {/* Scrolling Header */}
                    <div className="scrolling-section-header">
                        <div className="scrolling-header">
                            <span>Get In Touch</span><span role="img" aria-label="wave">👋</span>
                            <span>Collaborate</span><span role="img" aria-label="handshake">🤝</span>
                            <span>Build Together</span><span role="img" aria-label="building">🏗️</span>
                            <span>Connect</span><span role="img" aria-label="link">🔗</span>
                            <span>Get In Touch</span><span role="img" aria-label="wave">👋</span>
                            <span>Collaborate</span><span role="img" aria-label="handshake">🤝</span>
                            <span>Build Together</span><span role="img" aria-label="building">🏗️</span>
                            <span>Connect</span><span role="img" aria-label="link">🔗</span>
                        </div>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-card">
                            <div className="contact-icon github-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.216.682-.48 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                                </svg>
                            </div>
                            <h3>GitHub</h3>
                            <p>View my open source projects and contributions</p>
                            <a
                                href="https://github.com/akki-g"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                                aria-label="Visit GitHub Profile"
                            >
                                <span>@akki-g</span>
                                <svg className="link-arrow" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon linkedin-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                                </svg>
                            </div>
                            <h3>LinkedIn</h3>
                            <p>Connect with me professionally</p>
                            <a
                                href="https://www.linkedin.com/in/akshat-guduru-72b888290"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                                aria-label="Visit LinkedIn Profile"
                            >
                                <span>Connect</span>
                                <svg className="link-arrow" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon email-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <path d="M22 6l-10 7L2 6"/>
                                </svg>
                            </div>
                            <h3>Email</h3>
                            <p>Reach out for opportunities and collaborations</p>
                            <a
                                href="mailto:akshat.guduru@gmail.com"
                                className="contact-link"
                                aria-label="Send Email"
                            >
                                <span>Get in touch</span>
                                <svg className="link-arrow" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Home;