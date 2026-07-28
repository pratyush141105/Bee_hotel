/**
 * Formats a Date object or date string to a human-readable string.
 * @param {Date|string} date
 * @param {string} [locale='en-IN']
 * @returns {string}
 */
const formatDate = (date, locale = 'en-IN') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a Date to ISO 8601 string (YYYY-MM-DD).
 * @param {Date|string} date
 * @returns {string}
 */
const formatISODate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Returns true if the given date is in the future.
 * @param {Date|string} date
 * @returns {boolean}
 */
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

export { formatDate, formatISODate, isFutureDate };
