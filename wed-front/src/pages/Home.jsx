import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    }, []);

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
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-background-shape"></div>
                    <div className="hero-forefront-text">
                        <div className="firstName"><span>AKSHAT</span></div>
                        <div className="lastName"><span>GUDURU</span></div>
                    </div>
                    <div className="hero-intro">
                        <p>Hi<span role="img" aria-label="wave"> 👋</span></p>
                        <p>I'm a student studying </p>
                        <p>Computer Science </p>
                        <p>and Statistics</p>
                    </div>
                </section>

                {/* Projects Section */}
                <section className="projects-header">
                    <div className="scrolling-header">
                        <span>Check Out My Projects</span><span role="img" aria-label="smiling face">😇</span>
                        <span>Check Out My Projects</span><span role="img" aria-label="pointing down">👇</span>
                        <span>Check Out My Projects</span><span role="img" aria-label="nerd face">🤓</span>
                        <span>Check Out My Projects</span><span role="img" aria-label="pointing down">👇</span>
                        <span>Check Out My Projects</span><span role="img" aria-label="party face">🥳</span>
                        <span>Check Out My Projects</span><span role="img" aria-label="pointing down">👇</span>
                    </div>
                </section>

                {/* Project Grid */}
                {error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : (
                    <section className="projects-grid">
                        {projects.map((project, index) => (
                            <div 
                                key={project.id} 
                                className={`project-item ${
                                    projects.length % 2 !== 0 && index === projects.length - 1 
                                        ? 'full-width' 
                                        : ''
                                }`}
                            >
                                <ProjectBox project={project} />
                            </div>
                        ))}
                    </section>
                )}

                {/* Contact Section */}
                <section className="contact-header">
                    <div className="scrolling-header">
                        <span>Look Me Up</span><span role="img" aria-label="smiling face">😇</span>
                        <span>Contact Me</span><span role="img" aria-label="pointing down">👇</span>
                        <span>Look Me Up</span><span role="img" aria-label="nerd face">🤓</span>
                        <span>Contact Me</span><span role="img" aria-label="pointing down">👇</span>
                        <span>Look Me Up</span><span role="img" aria-label="party face">🥳</span>
                        <span>Contact Me</span><span role="img" aria-label="pointing down">👇</span>
                    </div>
                </section>

                {/* Contact Links */}
                <section className="contact-links">
                    <a
                        href="https://github.com/akki-g"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-logo"
                        aria-label="GitHub Profile"
                    />
                    {resume && (
                        <a 
                            href={resume} 
                            download="AkshatGuduru_Resume.pdf"
                            className="resume-link" 
                            aria-label="Download Resume"
                        >
                            💾
                        </a>
                    )}
                    <a
                        href="https://www.linkedin.com/in/akshat-guduru-72b888290"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkedin-logo"
                        aria-label="LinkedIn Profile"
                    >
                        <img src="/images/linkedin-logo.png" alt="LinkedIn" />
                    </a>
                </section>
            </div>
        </main>
    );
}

export default Home;