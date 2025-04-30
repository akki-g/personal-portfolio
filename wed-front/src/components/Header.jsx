import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Apply theme on initial load and when changed
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">AKKI</span>
          </Link>
        </div>

        <div className="header-actions">
          <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/">HOME</Link>
              </li>
              <li className={location.pathname === '/about' ? 'active' : ''}>
                <Link to="/about">ABOUT</Link>
              </li>
            </ul>
          </nav>

          <button
            className="theme-button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button 
            className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;