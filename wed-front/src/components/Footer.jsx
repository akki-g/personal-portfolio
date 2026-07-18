import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div>
          <p className="footer-kicker">Open to ambitious ideas</p>
          <h2>Let&apos;s build something useful.</h2>
          <a className="footer-email" href="mailto:akshat.guduru@gmail.com">
            akshat.guduru@gmail.com
          </a>
        </div>

        <div className="footer-links" aria-label="Footer links">
          <Link to="/projects">Projects</Link>
          <Link to="/about">About</Link>
          <a href="https://github.com/akki-g" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/akshat-guduru-72b888290" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>

        <div className="footer-meta">
          <p>Designed and built by Akshat Guduru.</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
