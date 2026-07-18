import { useEffect, useMemo, useState } from 'react';
import apiClient from './AxiosInstance';
import ProjectBox from '../components/features/ProjectBox';
import { getProjectYear, sortProjectsNewestFirst } from '../utils/projects';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [year, setYear] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortedProjects = useMemo(() => sortProjectsNewestFirst(projects), [projects]);
  const years = useMemo(() => ['All', ...new Set(sortedProjects.map(getProjectYear))], [sortedProjects]);
  const visibleProjects = year === 'All'
    ? sortedProjects
    : sortedProjects.filter((project) => getProjectYear(project) === year);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('projects/');
        setProjects(response.data);
      } catch (fetchError) {
        console.error('Error fetching projects:', fetchError);
        setError('Projects could not be loaded right now. Please try again shortly.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-page">
      <header className="projects-hero shell">
        <p className="eyebrow">Project archive</p>
        <h1>Ideas, experiments, and products.</h1>
        <div className="projects-hero-bottom">
          <p>
            A closer look at the software, research, and machine learning projects I&apos;ve taken from a rough question to a working system.
          </p>
          <span>{String(sortedProjects.length).padStart(2, '0')} published projects</span>
        </div>
      </header>

      <section className="projects-archive shell" aria-label="All projects">
        {!isLoading && !error && years.length > 2 && (
          <div className="project-filters" role="group" aria-label="Filter projects by year">
            <span>Filter by year</span>
            <div>
              {years.map((filterYear) => (
                <button
                  key={filterYear}
                  type="button"
                  className={year === filterYear ? 'is-active' : ''}
                  onClick={() => setYear(filterYear)}
                  aria-pressed={year === filterYear}
                >
                  {filterYear}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="loading-state" aria-live="polite">
            <div><span /> <p>Loading projects…</p></div>
          </div>
        ) : error ? (
          <div className="error-state"><p>{error}</p></div>
        ) : visibleProjects.length === 0 ? (
          <div className="empty-state"><p>No projects match this filter.</p></div>
        ) : (
          <div className="projects-overview-grid">
            {visibleProjects.map((project, index) => (
              <ProjectBox key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Projects;
