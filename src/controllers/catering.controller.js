import CateringService from '../services/cateringService.service.js';
import CateringInquiryService from '../services/cateringInquiry.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

// ─── Catering Packages (Services) ─────────────────────────────

export const listServices = async (req, res) => {
  const result = await CateringService.listServices(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getServiceById = async (req, res) => {
  const service = await CateringService.getServiceById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { service });
};

export const createService = async (req, res) => {
  const service = await CateringService.createService(req.body, req.files);
  successResponse(res, MESSAGES.CREATED, { service }, HTTP_STATUS.CREATED);
};

export const updateService = async (req, res) => {
  const service = await CateringService.updateService(req.params.id, req.body, req.files);
  successResponse(res, MESSAGES.UPDATED, { service });
};

export const deleteService = async (req, res) => {
  await CateringService.deleteService(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};

// ─── Catering Inquiries ────────────────────────────────────────

export const createInquiry = async (req, res) => {
  const inquiry = await CateringInquiryService.createInquiry(req.body);
  successResponse(res, 'Catering inquiry submitted successfully.', { inquiry }, HTTP_STATUS.CREATED);
};

export const listInquiries = async (req, res) => {
  const result = await CateringInquiryService.listInquiries(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getInquiryById = async (req, res) => {
  const inquiry = await CateringInquiryService.getInquiryById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { inquiry });
};

export const confirmInquiry = async (req, res) => {
  const inquiry = await CateringInquiryService.confirmInquiry(req.params.id);
  successResponse(res, 'Catering inquiry confirmed.', { inquiry });
};

export const rejectInquiry = async (req, res) => {
  const inquiry = await CateringInquiryService.rejectInquiry(req.params.id);
  successResponse(res, 'Catering inquiry rejected.', { inquiry });
};

export const completeInquiry = async (req, res) => {
  const inquiry = await CateringInquiryService.completeInquiry(req.params.id);
  successResponse(res, 'Catering inquiry marked as completed.', { inquiry });
};

export const deleteInquiry = async (req, res) => {
  await CateringInquiryService.deleteInquiry(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
