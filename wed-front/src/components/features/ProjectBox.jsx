/* eslint-disable react/prop-types */
import { useState } from 'react';
import { getTechnologies } from '../../utils/projects';
import './ProjectBox.css';

const ExternalIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M7 5H5.8A1.8 1.8 0 004 6.8v7.4A1.8 1.8 0 005.8 16h7.4a1.8 1.8 0 001.8-1.8V13M11 4h5v5M9 11l7-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProjectBox = ({ project, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const technologies = getTechnologies(project);
  const preview = project.short_desc || project.description || '';
  const hasLongDescription = (project.description || preview).length > 220;

  return (
    <article className={`project-card project-card--${(index % 3) + 1}${expanded ? ' is-expanded' : ''}`}>
      <div className="project-card-topline">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{project.monthyr}</span>
      </div>

      <div className="project-card-body">
        <h2>{project.title}</h2>
        <p>{expanded ? (project.description || preview) : preview}</p>
      </div>

      <div className="project-card-tech" aria-label="Technologies used">
        {technologies.slice(0, expanded ? technologies.length : 5).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
        {!expanded && technologies.length > 5 && <span>+{technologies.length - 5}</span>}
      </div>

      <div className="project-card-footer">
        <div className="project-card-links">
          {project.repo_link && (
            <a href={project.repo_link} target="_blank" rel="noreferrer">
              Repository <ExternalIcon />
            </a>
          )}
          {project.live_link && (
            <a href={project.live_link} target="_blank" rel="noreferrer">
              Live site <ExternalIcon />
            </a>
          )}
        </div>

        {hasLongDescription && (
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
            {expanded ? 'Show less' : 'More details'}
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
};

export default ProjectBox;
