import BranchService from '../services/branch.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const listBranches = async (req, res) => {
  const result = await BranchService.listBranches(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getBranchById = async (req, res) => {
  const branch = await BranchService.getBranchById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { branch });
};

export const createBranch = async (req, res) => {
  const branch = await BranchService.createBranch(req.body);
  successResponse(res, MESSAGES.CREATED, { branch }, HTTP_STATUS.CREATED);
};

export const updateBranch = async (req, res) => {
  const branch = await BranchService.updateBranch(req.params.id, req.body);
  successResponse(res, MESSAGES.UPDATED, { branch });
};

export const deleteBranch = async (req, res) => {
  await BranchService.deleteBranch(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
