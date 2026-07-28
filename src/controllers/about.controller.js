import AboutService from '../services/about.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';

export const getAbout = async (req, res) => {
  const data = await AboutService.getAbout();
  successResponse(res, MESSAGES.FETCHED, { about: data });
};

export const updateAbout = async (req, res) => {
  const updated = await AboutService.updateAbout(req.body);
  successResponse(res, MESSAGES.UPDATED, { about: updated });
};
