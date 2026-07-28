import AuthService from '../services/auth.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const login = async (req, res) => {
  const admin = await AuthService.login(res, req.body);
  successResponse(res, MESSAGES.LOGIN_SUCCESS, { admin });
};

export const logout = async (req, res) => {
  AuthService.logout(res);
  successResponse(res, MESSAGES.LOGOUT_SUCCESS);
};

export const getCurrentAdmin = async (req, res) => {
  const admin = await AuthService.getCurrentAdmin(req.admin.adminId);
  successResponse(res, MESSAGES.FETCHED, { admin });
};

export const updateProfile = async (req, res) => {
  const updated = await AuthService.updateProfile(req.admin.adminId, req.body);
  successResponse(res, MESSAGES.PROFILE_UPDATED, { admin: updated });
};

export const changePassword = async (req, res) => {
  await AuthService.changePassword(req.admin.adminId, req.body);
  successResponse(res, MESSAGES.PASSWORD_CHANGED);
};
