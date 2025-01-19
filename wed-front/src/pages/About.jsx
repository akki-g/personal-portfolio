import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import axios from 'axios';
import './Experiences';
import Experiences from './Experiences';

function About() {
    const [images, setImages] = useState({ image_1: '', image_2: '', image_3: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get('http://localhost:8000/api/get_images/')
          .then(response => {
            const data = response.data;
            setImages({
              image_1: data.image_1,
              image_2: data.image_2,
              image_3: data.image_3,
              // image_4: data.image_4, // if needed elsewhere
            });
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching images:', error);
            setError(err);
            setLoading(false);
          });
      }, []);
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error loading images.</p>;
    return (
        <main>
            <div className="about-container">
                <section className="about-intro">
                    <div className="about-intro-text">
                        <div className="intro-1">
                        <span>Nice to
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
                        <span>I'm Akshat
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
                <section className="content">
                    <div className="left-column">

                        <div className="info-block about">
                            <h2>About</h2>
                            <p>Computer Science Student from the University of Central Florida<br />
                            I love machine learning and AI.</p>
                        </div>
                        <div className="info-block role">
                            <h2>Role</h2>
                            <p>Machine Learning Researcher<br />
                            Prospective SDE Intern<br />
                        </p>
                        </div>
                        <div className="info-block contact">
                            <h2>Contact</h2>
                            <p>Git: @akki-g</p>
                            <p>Mail: akshat.guduru@gmail.com</p>
                            <p>Instagram: @akshatguduru</p>
                        </div>
                    </div>
                    <div className="right-column">
                        <Experiences />
                    </div>
                </section>
            </div>
        </main>
    );
}

export default About;