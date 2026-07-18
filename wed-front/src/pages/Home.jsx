import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from './AxiosInstance';
import { getProjectYear, getTechnologies, sortProjectsNewestFirst } from '../utils/projects';
import './Home.css';

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M7 5H5.8A1.8 1.8 0 004 6.8v7.4A1.8 1.8 0 005.8 16h7.4a1.8 1.8 0 001.8-1.8V13M11 4h5v5M9 11l7-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [resume, setResume] = useState(null);
  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const detailRef = useRef(null);

  const sortedProjects = useMemo(() => sortProjectsNewestFirst(projects), [projects]);
  const selectedProject = sortedProjects.find((project) => project.id === selectedId) || sortedProjects[0];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('projects/');
        setProjects(response.data);
        setSelectedId(sortProjectsNewestFirst(response.data)[0]?.id ?? null);
      } catch (fetchError) {
        console.error('Error fetching projects:', fetchError);
        setError('Projects could not be loaded right now. Please try again shortly.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let resumeUrl;

    const fetchResume = async () => {
      try {
        const response = await apiClient.get('download-resume', { responseType: 'blob' });
        resumeUrl = URL.createObjectURL(new Blob([response.data]));
        setResume(resumeUrl);
      } catch (fetchError) {
        console.error('Error fetching resume:', fetchError);
      }
    };

    fetchResume();
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await apiClient.get('about/');
        setAbout(response.data[0] ?? null);
      } catch (fetchError) {
        console.error('Error fetching current focus:', fetchError);
      }
    };

    fetchAbout();
  }, []);

  const selectProject = (projectId) => {
    setSelectedId(projectId);
    if (window.innerWidth < 860) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  };

  return (
    <div className="home-page">
      <section className="home-hero shell" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Researcher & software engineer</p>
          <h1 id="home-title">
            I build intelligent systems that turn <em>complexity</em> into something useful.
          </h1>
          <p className="hero-description">
            I&apos;m Akshat, a computer science and statistics student who works across machine learning,
            full-stack products, and research that moves from theory to practice.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#project-timeline">
              Explore selected work
              <ArrowIcon />
            </a>
            {resume && (
              <a className="button-secondary" href={resume} download="AkshatGuduru_Resume.pdf">
                Download résumé
              </a>
            )}
          </div>
        </div>

        {about?.current_focus_title && (
          <div className="hero-aside" aria-label="Current focus">
            {about.availability_text && (
              <div className="availability-pill">
                <span /> {about.availability_text}
              </div>
            )}
            <div className="focus-card">
              {about.current_focus_label && <p>{about.current_focus_label}</p>}
              <h2>{about.current_focus_title}</h2>
              <div className="focus-meta">
                {about.current_focus_organization && <span>{about.current_focus_organization}</span>}
                {about.current_focus_category && <span>{about.current_focus_category}</span>}
                {about.current_focus_period && <span>{about.current_focus_period}</span>}
              </div>
            </div>
            {(about.location_latitude || about.location_longitude) && (
              <div className="hero-coordinate" aria-hidden="true">
                <span>{about.location_latitude}</span>
                <span>{about.location_longitude}</span>
              </div>
            )}
          </div>
        )}
      </section>

      <section id="project-timeline" className="timeline-section">
        <div className="shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2>A timeline of things I&apos;ve built.</h2>
            </div>
            <p>
              Choose a point in time to see the project, the problem behind it, and the tools I used.
            </p>
          </div>

          {isLoading ? (
            <div className="loading-state" aria-live="polite">
              <div><span /> <p>Loading project timeline…</p></div>
            </div>
          ) : error ? (
            <div className="error-state"><p>{error}</p></div>
          ) : sortedProjects.length === 0 ? (
            <div className="empty-state"><p>No projects have been published yet.</p></div>
          ) : (
            <div className="timeline-workspace">
              <div className="timeline-list" role="tablist" aria-label="Project timeline">
                {sortedProjects.map((project, index) => {
                  const isActive = project.id === selectedProject?.id;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="timeline-project-detail"
                      className={`timeline-item${isActive ? ' is-active' : ''}`}
                      onClick={() => selectProject(project.id)}
                    >
                      <span className="timeline-rail" aria-hidden="true">
                        <span className="timeline-node" />
                        {index < sortedProjects.length - 1 && <span className="timeline-line" />}
                      </span>
                      <span className="timeline-date">
                        <strong>{getProjectYear(project)}</strong>
                        <small>{project.monthyr}</small>
                      </span>
                      <span className="timeline-title">{project.title}</span>
                      <span className="timeline-arrow"><ArrowIcon /></span>
                    </button>
                  );
                })}
              </div>

              <article
                ref={detailRef}
                id="timeline-project-detail"
                className="timeline-detail"
                role="tabpanel"
                key={selectedProject.id}
              >
                <div className="project-index">{String(sortedProjects.indexOf(selectedProject) + 1).padStart(2, '0')}</div>
                <div className="detail-topline">
                  <span>{selectedProject.monthyr}</span>
                  <span>Selected project</span>
                </div>
                <h3>{selectedProject.title}</h3>
                <p className="detail-summary">{selectedProject.short_desc || selectedProject.description}</p>
                <div className="detail-tech" aria-label="Technologies used">
                  {getTechnologies(selectedProject).slice(0, 6).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <div className="detail-actions">
                  {selectedProject.repo_link && (
                    <a className="button-primary" href={selectedProject.repo_link} target="_blank" rel="noreferrer">
                      View repository <ExternalIcon />
                    </a>
                  )}
                  {selectedProject.live_link && (
                    <a className="button-secondary" href={selectedProject.live_link} target="_blank" rel="noreferrer">
                      Live product <ExternalIcon />
                    </a>
                  )}
                  {!selectedProject.repo_link && !selectedProject.live_link && (
                    <Link className="text-link" to="/projects">Read the project overview <ArrowIcon /></Link>
                  )}
                </div>
              </article>
            </div>
          )}

          <div className="timeline-footer">
            <span>{sortedProjects.length} projects and counting</span>
            <Link className="text-link" to="/projects">View every project <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className="capabilities-section shell" aria-labelledby="capabilities-title">
        <div className="capabilities-intro">
          <p className="eyebrow">How I work</p>
          <h2 id="capabilities-title">Technical depth, product judgment.</h2>
        </div>
        <div className="capability-list">
          <article>
            <span>01</span>
            <h3>Machine learning</h3>
            <p>From model design and evaluation to production-ready data pipelines.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Product engineering</h3>
            <p>Full-stack systems that are reliable, understandable, and satisfying to use.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Research</h3>
            <p>Careful experiments and clear communication for open-ended technical problems.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
