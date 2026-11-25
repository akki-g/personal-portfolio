import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../pages/AxiosInstance';
import External from './External';
import { timelineCategories } from '../content';
import { getProjectDate, getProjectYear } from '../utils/projects';
import './Timeline.css';

// Month/year strings like "Sep 2026" or "Jun - July 2026" -> sortable timestamp and display year.
const dateOf = (text) => getProjectDate({ monthyr: text });
const yearOf = (text) => getProjectYear({ monthyr: text });
const isOngoing = (end) => /present|now|current|ongoing/i.test(end || '');
const hasSummary = (item) => Boolean(item.summary && item.summary.trim());
const categoryLabel = { research: 'Research', internships: 'Internship', projects: 'Project' };

// Only entries with a timeline summary (set in Django admin) appear here;
// the full descriptions live on /experience.
const toEntries = (experiences, projects) => [
  ...experiences.filter(hasSummary).map((item) => ({
    key: `experience-${item.id}`,
    category: item.type === 'internship' ? 'internships' : 'research',
    start: item.start_mthyr,
    dates: [item.start_mthyr, item.end_mthyr].filter(Boolean).join(' – '),
    current: isOngoing(item.end_mthyr),
    title: item.company,
    role: item.role,
    summary: item.summary,
  })),
  ...projects.filter(hasSummary).map((item) => ({
    key: `project-${item.id}`,
    category: 'projects',
    start: item.monthyr,
    dates: item.monthyr,
    title: item.title,
    summary: item.summary,
    url: item.live_link || item.repo_link,
  })),
];

function useTimelineEntries() {
  const [state, setState] = useState({ status: 'loading', entries: [] });

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiClient.get('experiences/'), apiClient.get('projects/')])
      .then(([experiences, projects]) => {
        if (!cancelled) setState({ status: 'ready', entries: toEntries(experiences.data, projects.data) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', entries: [] });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}

function Timeline() {
  const { status, entries } = useTimelineEntries();
  // Each category toggles on and off independently; all start on.
  const [active, setActive] = useState(() => new Set(timelineCategories.map(({ id }) => id)));
  const showLabels = active.size > 1;

  const toggle = (id) => setActive((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const counts = useMemo(() => Object.fromEntries(
    timelineCategories.map(({ id }) => [id, entries.filter((entry) => entry.category === id).length]),
  ), [entries]);

  // Group the selected categories by start year, newest first.
  const years = useMemo(() => {
    const groups = new Map();
    entries
      .filter((entry) => active.has(entry.category))
      .sort((a, b) => dateOf(b.start) - dateOf(a.start))
      .forEach((entry) => {
        const year = yearOf(entry.start);
        if (!groups.has(year)) groups.set(year, []);
        groups.get(year).push(entry);
      });
    return [...groups.entries()];
  }, [entries, active]);

  return (
    <div className="grid tl">
      <div className="tl-side">
        <h2 id="experience-title">Experience</h2>
        <p>Where I&apos;ve worked and what I&apos;ve built, newest first. Click a category to show or hide it.</p>

        <div className="tl-filters" role="group" aria-label="Show">
          {timelineCategories.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={active.has(id)}
              onClick={() => toggle(id)}
            >
              <span>{label}</span>
              {status === 'ready' && <span aria-hidden="true">{counts[id]}</span>}
            </button>
          ))}
        </div>

        <Link className="tl-all" to="/experience">Every position and project</Link>
      </div>

      {status === 'ready' && years.length > 0 && (
        <ol className="tl-list" aria-live="polite">
          {years.map(([year, yearEntries]) => (
            <li className="tl-year" key={year}>
              <span className="tl-year-label">{year}</span>
              <ol>
                {yearEntries.map((entry) => (
                  <li className={`tl-item${entry.current ? ' is-current' : ''}`} key={entry.key}>
                    <span className="tl-dates">
                      {entry.dates}
                      {showLabels && <span className="tl-kind">{categoryLabel[entry.category]}</span>}
                    </span>
                    <div className="tl-body">
                      <div className="tl-title">
                        {entry.url ? <External href={entry.url}><b>{entry.title}</b></External> : <b>{entry.title}</b>}
                        {entry.role && <>, {entry.role}</>}
                      </div>
                      <p>{entry.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}

      {status !== 'ready' || years.length === 0 ? (
        <p className="tl-message" role={status === 'error' ? 'alert' : undefined} aria-live="polite">
          {status === 'loading' && 'Loading…'}
          {status === 'error' && <>This couldn&apos;t load right now. Try the <Link to="/experience">full list</Link> or the résumé.</>}
          {status === 'ready' && (active.size ? 'Nothing here yet.' : 'Pick a category above to see entries.')}
        </p>
      ) : null}
    </div>
  );
}

export default Timeline;
