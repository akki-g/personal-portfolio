/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import apiClient from './AxiosInstance';
import External from '../components/External';
import SiteFooter from '../components/SiteFooter';
import useResumeUrl from '../hooks/useResumeUrl';
import { links } from '../content';
import { sortExperiencesMostRecent } from '../utils/experiences';
import { getTechnologies, sortProjectsNewestFirst } from '../utils/projects';
import '../styles/site.css';
import './Experience.css';

// Descriptions come from Django admin as "•"-separated bullets with hard line wraps.
const toBullets = (text = '') => text
  .split('•')
  .map((part) => part.replace(/-\s*\r?\n\s*/g, '-').replace(/\s*\r?\n\s*/g, ' ').trim())
  .filter(Boolean);

const isInternship = (item) => item.type === 'internship';

const formatDates = (item) => [item.start_mthyr, item.end_mthyr].filter(Boolean).join(' – ');

function Entry({ dates, title, subtitle, bullets, meta }) {
  return (
    <article className="entry">
      <span className="entry-dates">{dates}</span>
      <div className="entry-body">
        <h3><b>{title}</b>{subtitle && <>, {subtitle}</>}</h3>
        {bullets.length > 1 ? (
          <ul>{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        ) : (
          bullets.map((bullet) => <p key={bullet}>{bullet}</p>)
        )}
        {meta && <p className="entry-meta">{meta}</p>}
      </div>
    </article>
  );
}

function Experience() {
  const resume = useResumeUrl();
  const { hash } = useLocation();
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    Promise.all([apiClient.get('experiences/'), apiClient.get('projects/')])
      .then(([experienceResponse, projectResponse]) => {
        setExperiences(sortExperiencesMostRecent(experienceResponse.data));
        setProjects(sortProjectsNewestFirst(projectResponse.data));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  // Sections only exist once data arrives, so jump to #research etc. after that.
  useEffect(() => {
    if (status === 'ready' && hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [status, hash]);

  const sections = useMemo(() => [
    { id: 'research', label: 'Research', items: experiences.filter((item) => !isInternship(item)) },
    { id: 'internships', label: 'Internships', items: experiences.filter(isInternship) },
    { id: 'projects', label: 'Projects', items: projects },
  ], [experiences, projects]);

  const renderItem = (sectionId, item) => {
    if (sectionId === 'projects') {
      const technologies = getTechnologies(item);
      const meta = (
        <>
          {technologies.join(', ')}
          {item.live_link && <> · <External href={item.live_link}>Live</External></>}
          {item.repo_link && item.repo_link !== item.live_link && <> · <External href={item.repo_link}>Source</External></>}
        </>
      );
      return (
        <Entry
          key={item.id}
          dates={item.monthyr}
          title={item.title}
          bullets={toBullets(item.short_desc || item.description)}
          meta={meta}
        />
      );
    }
    return (
      <Entry
        key={item.id}
        dates={formatDates(item)}
        title={item.company}
        subtitle={item.role}
        bullets={toBullets(item.description)}
      />
    );
  };

  return (
    <div className="site archive">
      <header className="top">
        <Link className="name" to="/">Akshat Guduru</Link>
        <nav aria-label="Main">
          <Link className="hide-sm" to="/">Home</Link>
          <External href={resume}>Résumé</External>
          <a href={`mailto:${links.email}`}>Email</a>
        </nav>
      </header>

      <main>
        <section className="grid archive-head">
          <h1>Everything I&apos;ve worked on.</h1>
          <p>Every research position, internship and project, with the full details. The home page has the short version.</p>
          <nav className="archive-jump" aria-label="Jump to">
            {sections.map(({ id, label, items }) => (
              <a key={id} href={`#${id}`}>{label}{status === 'ready' && ` (${items.length})`}</a>
            ))}
          </nav>
        </section>

        {status === 'loading' && <p className="grid archive-status" aria-live="polite"><span>Loading…</span></p>}
        {status === 'error' && (
          <p className="grid archive-status" role="alert">
            <span>This couldn&apos;t load right now. The <External href={resume}>résumé</External> has the same information.</span>
          </p>
        )}

        {status === 'ready' && sections.map(({ id, label, items }) => (
          <section key={id} id={id} className="grid archive-section" aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`}>{label}</h2>
            <div className="archive-list">
              {items.length ? items.map((item) => renderItem(id, item)) : <p>Nothing here yet.</p>}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter resume={resume} />
    </div>
  );
}

export default Experience;
