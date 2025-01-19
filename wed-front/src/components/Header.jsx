import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 


function Header() { 
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        document.body.setAttribute('data-theme', newTheme); 
    }
    return (
        <header className = "site-header">
            <div className="header-logo">
                <span><Link to="/">AKKI</Link></span>
            </div>
            
            <nav className="header-nav">
                <ul>
                    <li>
                        <Link to="/">HOME</Link>
                    </li>
                    <li>
                        <Link to="/about">ABOUT</Link>
                    </li>
                </ul>
                <div className="theme-toggle">
                {/* Toggle Container */}
                    <div className="toggle-container">
                        {/* Checkbox (hidden visually) */}
                        <input
                        type="checkbox"
                        id="themeToggle"
                        className="toggle-checkbox"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                        />
                        {/* The label that becomes our slider track + handle */}
                        <label className="toggle-label" htmlFor="themeToggle">
                        <span className="toggle-handle">
                            {/* Sun and moon icons inside the handle */}
                            <span className="icon-sun">☀️</span>
                            <span className="icon-moon">🌙</span>
                        </span>
                        </label>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;