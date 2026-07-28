import ValidationError from '../errors/ValidationError.js';

/**
 * Reusable Zod validation middleware factory.
 * Validates req.body, req.params, and req.query against provided Zod schemas.
 *
 * @param {object} schemas - Zod schemas for body, params, query (all optional).
 * @param {import('zod').ZodSchema} [schemas.body]
 * @param {import('zod').ZodSchema} [schemas.params]
 * @param {import('zod').ZodSchema} [schemas.query]
 * @returns {import('express').RequestHandler}
 */
const validate = (schemas) => (req, res, next) => {
  const errors = [];

  const validatePart = (schema, data, source) => {
    if (!schema) return;
    const result = schema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        errors.push({
          field: `${source}.${err.path.join('.')}`,
          message: err.message,
        });
      });
    } else {
      // Assign parsed/coerced data back to request
      req[source] = result.data;
    }
  };

  validatePart(schemas.body, req.body, 'body');
  validatePart(schemas.params, req.params, 'params');
  validatePart(schemas.query, req.query, 'query');

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};

export { validate };
