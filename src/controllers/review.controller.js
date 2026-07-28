import ReviewService from '../services/review.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const listReviews = async (req, res) => {
  const result = await ReviewService.listReviews(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const addReview = async (req, res) => {
  const review = await ReviewService.addReview(req.body);
  successResponse(res, MESSAGES.CREATED, { review }, HTTP_STATUS.CREATED);
};

export const approveReview = async (req, res) => {
  const review = await ReviewService.approveReview(req.params.id);
  successResponse(res, MESSAGES.REVIEW_APPROVED, { review });
};

export const deleteReview = async (req, res) => {
  await ReviewService.deleteReview(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
