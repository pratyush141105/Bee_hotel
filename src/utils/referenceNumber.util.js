import { nanoid } from 'nanoid';

/**
 * Generates a date-stamped reference number.
 *
 * Format: PREFIX-YYYYMMDD-XXXX (daily sequential style via nanoid)
 * Example: BNQ-20260727-8F93K2
 *
 * @param {string} prefix - 2–4 char prefix (e.g. 'BNQ', 'CAT', 'EVT', 'CNT')
 * @returns {string} Unique reference number
 */
const generateReferenceNumber = (prefix) => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const uniquePart = nanoid(6).toUpperCase(); // e.g. 8F93K2
  return `${prefix.toUpperCase()}-${datePart}-${uniquePart}`;
};

export { generateReferenceNumber };
