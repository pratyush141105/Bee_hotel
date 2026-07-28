/**
 * Builds pagination metadata for list responses.
 * @param {number} total - Total number of matching documents.
 * @param {number} page - Current page number (1-indexed).
 * @param {number} limit - Number of items per page.
 * @returns {object} Pagination meta object.
 */
const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Builds Mongoose query options (skip, limit, sort) from request query params.
 * @param {object} params
 * @param {string|number} [params.page=1]
 * @param {string|number} [params.limit=10]
 * @param {string} [params.sort='createdAt']
 * @param {string} [params.order='desc']
 * @returns {object} { skip, limit, sort, page }
 */
const buildQueryOptions = ({ page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = {}) => {
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  const sortOrder = order === 'asc' ? 1 : -1;

  return {
    skip,
    limit: parsedLimit,
    sort: { [sort]: sortOrder },
    page: parsedPage,
  };
};

export { buildPaginationMeta, buildQueryOptions };
