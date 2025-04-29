import React, { useEffect, useState } from 'react';
import './Experiences.css';
import apiClient from '../../pages/AxiosInstance';

/**
 * Component that displays professional experience in an interactive format
 */
const Experiences = () => {
  const [experiences, setExperiences] = useState([]);  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('experiences');
        setExperiences(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('Failed to load experiences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const activeExperience = experiences[activeIndex] || null;

  if (isLoading) return <div className="experiences-loading">Loading experiences...</div>;
  if (error) return <div className="experiences-error">{error}</div>;
  if (experiences.length === 0) return <div className="experiences-empty">No experiences available</div>;

  return (
    <div className="experiences-container">
      <h2>Experiences</h2>

      <div className="experience-scroller">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className={`experience-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {exp.role}
          </div>
        ))}
      </div>

      {activeExperience && (
        <div className="experience-detail">
          <h3>{activeExperience.company}</h3>
          <div className="experience-period">
            {activeExperience.start_mthyr} - {activeExperience.end_mthyr || 'Present'}
          </div>
          <p className="experience-description">{activeExperience.description}</p>
        </div>
      )}
    </div>
  );
};

export default Experiences;