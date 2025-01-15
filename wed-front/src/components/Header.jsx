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
                <div className = "theme-toggle">
                    <button onClick={toggleTheme}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;