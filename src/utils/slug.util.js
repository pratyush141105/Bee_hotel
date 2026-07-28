import { nanoid } from 'nanoid';

/**
 * Generates a URL-friendly slug from a given string.
 * Appends a short unique ID to avoid collisions.
 * @param {string} name - Input string to slugify.
 * @returns {string} URL-safe slug with unique suffix.
 */
const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // Remove special characters
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-');            // Collapse multiple hyphens

  const uniqueSuffix = nanoid(6);
  return `${base}-${uniqueSuffix}`;
};

/**
 * Generates a slug from a string without a unique suffix.
 * Use only when the name itself is guaranteed unique.
 * @param {string} name
 * @returns {string}
 */
const generateSimpleSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export { generateSlug, generateSimpleSlug };
