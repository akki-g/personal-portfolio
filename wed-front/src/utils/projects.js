const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export const getProjectDate = (project) => {
  const value = project.monthyr || '';
  const yearMatch = value.match(/\b(19|20)\d{2}\b/g);
  const year = yearMatch ? Number(yearMatch.at(-1)) : 0;
  const monthMatches = value.toLowerCase().match(/[a-z]{3,}/g) || [];
  const month = monthMatches.reduce((latest, word) => {
    const key = word.slice(0, 3);
    return key in MONTHS ? MONTHS[key] : latest;
  }, 11);

  return new Date(year, month, 1).getTime();
};

export const sortProjectsNewestFirst = (projects) => (
  [...projects].sort((a, b) => getProjectDate(b) - getProjectDate(a))
);

export const getProjectYear = (project) => {
  const match = (project.monthyr || '').match(/\b(19|20)\d{2}\b/g);
  return match ? match.at(-1) : 'Recent';
};

export const getTechnologies = (project) => (
  (project.technologies || '')
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean)
);
