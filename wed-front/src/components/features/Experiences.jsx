import { useEffect, useState } from 'react';
import apiClient from '../../pages/AxiosInstance';
import { sortExperiencesMostRecent } from '../../utils/experiences';
import './Experiences.css';

function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await apiClient.get('experiences/');
        setExperiences(sortExperiencesMostRecent(response.data));
      } catch (fetchError) {
        console.error('Error fetching experiences:', fetchError);
        setError('Experience details could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) return <div className="experience-state">Loading experience…</div>;
  if (error) return <div className="experience-state">{error}</div>;
  if (experiences.length === 0) return <div className="experience-state">No experience has been published yet.</div>;

  const activeExperience = experiences[activeIndex];

  return (
    <div className="experiences-container">
      <div className="experience-tabs" role="tablist" aria-label="Professional experience">
        {experiences.map((experience, index) => (
          <button
            key={experience.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls="experience-panel"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => setActiveIndex(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{experience.company}</strong>
            <small>{experience.role}</small>
          </button>
        ))}
      </div>

      <article id="experience-panel" className="experience-panel" role="tabpanel" key={activeExperience.id}>
        <div className="experience-period">
          {activeExperience.start_mthyr} to {activeExperience.end_mthyr || 'Present'}
        </div>
        <h3>{activeExperience.role}</h3>
        <p className="experience-company">{activeExperience.company}</p>
        <p className="experience-description">{activeExperience.description}</p>
      </article>
    </div>
  );
}

export default Experiences;
