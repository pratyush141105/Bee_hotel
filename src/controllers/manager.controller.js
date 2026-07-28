import ManagerService from '../services/manager.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const listManagers = async (req, res) => {
  const result = await ManagerService.listManagers(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getManagerById = async (req, res) => {
  const manager = await ManagerService.getManagerById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { manager });
};

export const createManager = async (req, res) => {
  const manager = await ManagerService.createManager(req.body);
  successResponse(res, MESSAGES.CREATED, { manager }, HTTP_STATUS.CREATED);
};

export const updateManager = async (req, res) => {
  const manager = await ManagerService.updateManager(req.params.id, req.body);
  successResponse(res, MESSAGES.UPDATED, { manager });
};

export const deleteManager = async (req, res) => {
  await ManagerService.deleteManager(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
