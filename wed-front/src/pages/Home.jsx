import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Chat from '../components/Chat';
import External from '../components/External';
import SiteFooter from '../components/SiteFooter';
import Timeline from '../components/Timeline';
import useResumeUrl from '../hooks/useResumeUrl';
import { facts, headline, links, projects } from '../content';
import '../styles/site.css';
import './Home.css';

// On phones the page becomes four tabs instead of one long scroll.
const tabs = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const tabForHash = { '#work': 'work', '#experience': 'experience', '#ask': 'contact', '#contact': 'contact' };

function Home() {
  const resume = useResumeUrl();
  const { hash } = useLocation();
  const [tab, setTab] = useState(() => tabForHash[hash] || 'about');
  const mailto = `mailto:${links.email}`;

  // React renders after the browser's own anchor jump, so links like /#experience
  // need to scroll (desktop) or pick the matching tab (phone) once the page exists.
  useEffect(() => {
    if (!hash) return;
    if (tabForHash[hash]) setTab(tabForHash[hash]);
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, [hash]);

  const openTab = (id) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const panel = (id) => `panel${tab === id ? ' is-active' : ''}`;

  return (
    <div className="site home">
      <header className="top">
        <a className="name" href="/">Akshat Guduru</a>
        <nav aria-label="Main">
          <Link to="/experience">Experience</Link>
          {/* On phones, Résumé and Email live in the Contact tab. */}
          <External className="hide-sm" href={resume}>Résumé</External>
          <a className="hide-sm" href={mailto}>Email</a>
        </nav>
      </header>

      <main>
        <div className={panel('about')}>
          <section className="grid hero">
            <h1>{headline}</h1>
          </section>

          <section className="grid facts" aria-label="About">
            <img className="portrait" src="/images/portrait.jpg" alt="Akshat Guduru" width="900" height="1125" />
            <div className="fact-row">
              {facts.map((fact) => (
                <div className="fact" key={fact.label}>
                  <b>{fact.label}</b>
                  {fact.text}
                </div>
              ))}
              <div className="fact">
                <b>Elsewhere</b>
                <External href={links.github}>GitHub</External>, <External href={links.linkedin}>LinkedIn</External>,{' '}
                <External href={resume}>Résumé</External>. Based in Orlando.
              </div>
            </div>
          </section>
        </div>

        <section id="work" className={`${panel('work')} work-section`} aria-labelledby="work-title">
          <div className="grid head">
            <h2 id="work-title">Selected work</h2>
            <p>All three are live and run on a server I maintain.</p>
          </div>
          <div className="grid work">
            {projects.map((project) => (
              <article className="project" key={project.title}>
                <a className="shot" href={project.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
                  <img src={project.image} alt="" loading="lazy" width="1440" height="900" />
                </a>
                <div className="project-title">
                  <External href={project.url}><b>{project.title}</b></External>
                  <span>{project.year}</span>
                </div>
                <p>{project.description}</p>
                <p className="stack">
                  {project.stack}
                  {project.source && <> · <External href={project.source}>Source</External></>}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className={panel('experience')} aria-labelledby="experience-title">
          <Timeline />
        </section>

        {/* On phones this sits in the Contact tab, above the email and links. */}
        <section id="ask" className={panel('contact')} aria-labelledby="chat-title">
          <Chat />
        </section>
      </main>

      <div id="contact" className={panel('contact')}>
        <SiteFooter resume={resume} />
      </div>

      <nav className="tabbar" aria-label="Sections">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => openTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Home;
