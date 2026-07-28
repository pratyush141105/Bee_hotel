import SettingsService from '../services/settings.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';

export const getSettings = async (req, res) => {
  const data = await SettingsService.getSettings();
  successResponse(res, MESSAGES.FETCHED, { settings: data });
};

export const updateSettings = async (req, res) => {
  const updated = await SettingsService.updateSettings(req.body);
  successResponse(res, MESSAGES.UPDATED, { settings: updated });
};

export const updateLogo = async (req, res) => {
  const updated = await SettingsService.updateLogo(req.file);
  successResponse(res, MESSAGES.UPDATED, { settings: updated });
};

export const updateQR = async (req, res) => {
  const updated = await SettingsService.updateQR(req.file);
  successResponse(res, MESSAGES.UPDATED, { settings: updated });
};
