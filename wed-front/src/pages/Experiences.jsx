import React, { useEffect, useState } from 'react';
import './Experiences.css';
import axios from 'axios';
import apiClient from './AxiosInstance';

function Experiences() {
  
  const [experiences, setExperiences] = useState([]);  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
      apiClient.get('experiences')
      .then(response => {
        setExperiences(response.data);
      })
      .catch((error) => {
          console.error('Error fetching data: ', error);
      });
  }, []);

  const activeExperience = experiences[activeIndex] || null;
  return (
    <div className="experiences-container">
      <h2>Experiences</h2>

      <div className="experience-scroller">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className={`experience-item ${
              index === activeIndex ? 'active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {exp.role}
          </div>
        ))}
      </div>

      {/* Display selected experience’s description */}
      {activeExperience ? (
        <div className="experience-detail">
          <h3>
            {activeExperience.company}
          </h3>
          <p>
            {activeExperience.start_mthyr} - {activeExperience.end_mthyr}
          </p>
          <p>{activeExperience.description}</p>
        </div>
      ) : (
        <p>No experiences yet.</p>
      )}
      </div>
  );
}

export default Experiences;
