import HomeContentService from '../services/homeContent.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';

export const getHome = async (req, res) => {
  const data = await HomeContentService.getHome();
  successResponse(res, MESSAGES.FETCHED, { home: data });
};

export const updateHome = async (req, res) => {
  const heroFiles = req.files?.heroImages || [];
  const updated = await HomeContentService.updateHome(req.body, heroFiles);
  successResponse(res, MESSAGES.UPDATED, { home: updated });
};
