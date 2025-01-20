import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import './Home.css';
import axios from 'axios';

function Home() {
    const [projects, setProjects] = useState([]);  
    const [resume, setResume] = useState(null);
    const token = import.meta.env.REACT_APP_API_TOKEN;
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('https://api.its-akki.com/api/projects', { headers })
        .then(response => {
            setProjects(response.data);
        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });
    }, []);

    useEffect(() => {
        axios.get('https://api.its-akki.com/api/download-resume', { headers }, {
            responseType: 'blob'
        })
        .then(response => {
            const url = URL.createObjectURL(new Blob([response.data]));
            setResume(url);
        })
        .catch((error) => {
            console.error('Error fetching data: ', error);
        });

        return () => {
            if (resume) {
                URL.revokeObjectURL(resume);
            }
        }
    }, []);
    return (
        <main>
            <div className = "home-container">
                {/* Hero */}
                <section className = "hero">
                    <div className = "hero-forefront-text">
                        <div className = "firstName"><span>AKSHAT</span></div>
                        <br/>
                        <div className = "lastName"><span>GUDURU</span></div>
                    </div>
                    <div className = "hero-intro">
                        <p>Hi<span role="img" aria-label = "wave"> 👋</span></p>
                        <p>I'm a student studying </p>
                        <p>Computer Science </p>
                        <p>and Statistics</p>
                    </div>
                </section>
                {/* Projects */}

                <section className = "projects-header">
                    <div className="scrolling-header">
                        <span>Check Out My Projects</span><span>😇</span>
                        <span>Check Out My Projects</span><span>👇</span>
                        <span>Check Out My Projects</span><span>🤓</span>
                        <span>Check Out My Projects</span><span>👇</span>
                        <span>Check Out My Projects</span><span>🥳</span>
                        <span>Check Out My Projects</span><span>👇</span>
                        <span>Check Out My Projects</span><span>😇</span>
                        <span>Check Out My Projects</span><span>👇</span>
                        <span>Check Out My Projects</span><span>🤓</span>
                        <span>Check Out My Projects</span><span>👇</span>
                        <span>Check Out My Projects</span><span>🥳</span>
                        <span>Check Out My Projects</span><span>👇</span>
                    </div>
                </section>
                <section className = "projects">
                {projects.map((project) => (
                    <div key={project.id} className="project-entry">
                    {/* Customize each project entry with desired content, e.g.: */}
                    <div className="border-top"></div>
                    <div className="border-right"></div>
                    <div className="border-bottom"></div>
                    <div className="border-left"></div>
                    <h3>{project.title}</h3>
                    <p>{project.short_desc}</p>
                    {/* You can add links or images as needed */}
                    </div>
                ))}
                </section>
                <section className = "contact-header">
                    <div className="scrolling-header">
                        <span>Look Me Up</span><span>😇</span>
                        <span>Contact Me</span><span>👇</span>
                        <span>Look Me Up</span><span>🤓</span>
                        <span>Contact Me</span><span>👇</span>
                        <span>Look Me Up</span><span>🥳</span>
                        <span>Contact Me</span><span>👇</span>
                        <span>Look Me Up</span><span>😇</span>
                        <span>Contact Me</span><span>👇</span>
                        <span>Look Me Up</span><span>🤓</span>
                        <span>Contact Me</span><span>👇</span>
                        <span>Look Me Up</span><span>🥳</span>
                        <span>Contact Me</span><span>👇</span>
                    </div>
                </section>
                <section className="contact-links">
                    <a
                        href="https://github.com/akki-g"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-logo"
                        aria-label="GitHub Profile"
                    >
                        {/* Logo will be set as a background image via CSS */}
                    </a>
                    {resume && (
                        <a href={resume} 
                        download="AkshatGuduru_Resume.pdf"
                        className="resume-link" 
                        aria-label="Download Resume">
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
