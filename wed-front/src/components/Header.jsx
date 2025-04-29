import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="site-header">
      <div className="header-logo">
        <Link to="/">AKKI</Link>
      </div>

      <nav className="header-nav">
        <ul>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
        </ul>
      </nav>

      <button
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        onClick={toggleTheme}
        className="theme-button"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}

export default Header;
