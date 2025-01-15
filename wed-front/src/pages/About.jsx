import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {

    return (
        <main>
            <div className="content">
                <div className="left-column">

                    <div className="info-block about">
                        <h2>About</h2>
                        <p>Computer Science Student from the University of Central Florida<br />
                        I love machine learning and AI.</p>
                    </div>

                    <div className="info-block role">
                        <h2>Role</h2>
                        <p>Machine Learning<br />
                        Prospective SDE Intern<br />
                    </p>
                    </div>
                    <div className="info-block awards">
                        <h2>Awards</h2>
                        <ul>
                        <li>PORTFOLIO2023 / CSS WINNER (SOTD)</li>
                        <li>MARNON / FWA (FOTD)</li>
                        <li>PORTFOLIO2020 / Awwwards (Honorable Mention / Mobile Excellence)</li>
                        <li>PORTFOLIO2020 / CSSDA (Special Kudos)</li>
                        </ul>
                    </div>

                    <div className="info-block contact">
                        <h2>Contact</h2>
                        <p>Git: @akki-g</p>
                        <p>Mail: akshat.guduru@gmail.com</p>
                        <p>Instagram: @akshatguduru</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default About;