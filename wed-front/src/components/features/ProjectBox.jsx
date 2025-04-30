import React from 'react';
import './ProjectBox.css';

/**
 * ProjectBox component to display a single project
 * @param {Object} project - The project data
 */
const ProjectBox = ({ project }) => {
  return (
    <div className="project-box">
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.short_desc || project.description}</p>
      <div className="project-technologies">
        {project.technologies && (
          <span>{project.technologies}</span>
        )}
      </div>
      <div className="project-links">
        {project.repo_link && (
          <a 
            href={project.repo_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
            aria-label={`GitHub repository for ${project.title}`}
          >
            GitHub
          </a>
        )}
        {project.live_link && (
          <a 
            href={project.live_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="live-link"
            aria-label={`Live demo for ${project.title}`}
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectBox;