import ReviewRepository from '../repositories/review.repository.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const ReviewService = {
  listReviews: async (queryParams) => {
    const { search, approved } = queryParams;
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (approved !== undefined) filter.approved = approved === 'true';

    if (search) {
      const items = await ReviewRepository.search(search, filter, options);
      return { reviews: items };
    }

    const [reviews, total] = await Promise.all([
      ReviewRepository.findAll(filter, options),
      ReviewRepository.count(filter),
    ]);
    return { reviews, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  addReview: async (data) => {
    return ReviewRepository.create(data);
  },

  approveReview: async (id) => {
    const review = await ReviewRepository.findById(id);
    if (!review) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return ReviewRepository.approve(id);
  },

  deleteReview: async (id) => {
    const review = await ReviewRepository.findById(id);
    if (!review) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    await ReviewRepository.delete(id);
  },
};

export default ReviewService;
