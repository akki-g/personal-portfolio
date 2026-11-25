/* eslint-disable react/prop-types */
import External from './External';
import { links, location } from '../content';

function SiteFooter({ resume, className = '' }) {
  return (
    <footer className={`bottom ${className}`}>
      <a className="mail" href={`mailto:${links.email}`}>{links.email}</a>
      <div className="base">
        <span className="base-links">
          <External href={links.github}>GitHub</External>
          <External href={links.linkedin}>LinkedIn</External>
          <External href={resume}>Résumé</External>
        </span>
        <span>{location} · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
