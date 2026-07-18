import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
];

function Header() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header-shell">
        <Link to="/" className="brand" aria-label="Akshat Guduru, home">
          <span className="brand-name">Akshat Guduru</span>
          <span className="brand-role">Portfolio</span>
        </Link>

        <div className={`nav-wrap${menuOpen ? ' is-open' : ''}`}>
          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <a className="mobile-contact" href="mailto:akshat.guduru@gmail.com">
            Email me
          </a>
        </div>

        <div className="header-actions">
          <a className="header-contact" href="mailto:akshat.guduru@gmail.com">
            Email me
          </a>

          <div className="header-controls">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.2 15.2A8.4 8.4 0 018.8 3.8 8.5 8.5 0 1020.2 15.2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
