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

const ONGOING_LABELS = new Set(['present', 'current', 'now', 'ongoing']);

const getMonthYearTimestamp = (value, treatBlankAsOngoing = false) => {
  const normalized = (value || '').trim().toLowerCase();

  if (ONGOING_LABELS.has(normalized) || (treatBlankAsOngoing && !normalized)) {
    return Number.POSITIVE_INFINITY;
  }

  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/g);
  if (!yearMatch) return 0;

  const year = Number(yearMatch.at(-1));
  const monthWord = (normalized.match(/[a-z]{3,}/g) || [])
    .find((word) => word.slice(0, 3) in MONTHS);
  const month = monthWord ? MONTHS[monthWord.slice(0, 3)] : 11;

  return Date.UTC(year, month, 1);
};

export const sortExperiencesMostRecent = (experiences) => (
  [...experiences].sort((a, b) => {
    const endDifference = getMonthYearTimestamp(b.end_mthyr, true)
      - getMonthYearTimestamp(a.end_mthyr, true);
    if (endDifference !== 0 && !Number.isNaN(endDifference)) return endDifference;

    const startDifference = getMonthYearTimestamp(b.start_mthyr)
      - getMonthYearTimestamp(a.start_mthyr);
    if (startDifference !== 0) return startDifference;

    return (b.id || 0) - (a.id || 0);
  })
);
