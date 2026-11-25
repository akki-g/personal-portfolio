// All copy on the home page lives here, so it can be edited without touching layout code.

export const links = {
  email: 'akshat.guduru@gmail.com',
  github: 'https://github.com/akki-g',
  linkedin: 'https://www.linkedin.com/in/akshat-guduru-72b888290',
  // Fallback if the API can't be reached; normally replaced by the résumé uploaded in Django admin.
  resume: 'https://api.its-akki.com/media/files/AkshatGuduru_Resume.pdf',
};

export const headline =
  "I'm Akshat, a computer science and statistics student at UCF. I do reinforcement learning research and build software on the side.";

export const facts = [
  { label: 'Now', text: 'Research at three UCF labs: racing cars, power grids, multi-agent RL.' },
  { label: 'Before', text: 'Software developer intern at IBM, summer 2026.' },
  { label: 'Studying', text: 'Computer Science and Statistics at UCF. Graduating 2027.' },
];

export const projects = [
  {
    title: 'CitePilot',
    year: '2026',
    description: 'A LaTeX workspace with a citation graph and research agents that show their sources.',
    stack: 'FastAPI, pgvector, Neo4j, Redis',
    image: '/images/work/citepilot.jpg',
    url: 'https://citepilot.its-akki.com',
  },
  {
    title: 'Posted',
    year: '2026',
    description: 'Brokerage and bank accounts in one statement, with news filtered to what you hold.',
    stack: 'React Native, Schwab API, Plaid',
    image: '/images/work/posted.jpg',
    url: 'https://posted.its-akki.com',
  },
  {
    title: 'Job Signal',
    year: '2026',
    description: 'Reads your résumé, matches early-career roles, and sends one daily digest.',
    stack: 'React, FastAPI, Postgres, Claude',
    image: '/images/work/jobs.jpg',
    url: 'https://jobs.its-akki.com',
    source: 'https://github.com/akki-g/automated_swe_jobs',
  },
];

// Filters for the home page timeline. Entries come from the API: experiences by `type`, plus projects.
// Only entries with a `summary` set in Django admin appear on the timeline.
export const timelineCategories = [
  { id: 'research', label: 'Research' },
  { id: 'internships', label: 'Internships' },
  { id: 'projects', label: 'Projects' },
];

export const location = 'Orlando, Florida';
