import ContactService from '../services/contact.service.js';
import ContactInquiryService from '../services/contactInquiry.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

// ─── Contact Info (singleton) ─────────────────────────────────

export const getContact = async (req, res) => {
  const data = await ContactService.getContact();
  successResponse(res, MESSAGES.FETCHED, { contact: data });
};

export const updateContact = async (req, res) => {
  const updated = await ContactService.updateContact(req.body);
  successResponse(res, MESSAGES.UPDATED, { contact: updated });
};

// ─── Contact Inquiries ────────────────────────────────────────

export const createContactInquiry = async (req, res) => {
  const inquiry = await ContactInquiryService.createInquiry(req.body);
  successResponse(res, 'Message sent successfully. We will get back to you soon.', { inquiry }, HTTP_STATUS.CREATED);
};

export const listContactInquiries = async (req, res) => {
  const result = await ContactInquiryService.listInquiries(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getContactInquiryById = async (req, res) => {
  const inquiry = await ContactInquiryService.getInquiryById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { inquiry });
};

export const markInquiryAsRead = async (req, res) => {
  const inquiry = await ContactInquiryService.markAsRead(req.params.id);
  successResponse(res, 'Inquiry marked as read.', { inquiry });
};

export const closeContactInquiry = async (req, res) => {
  const inquiry = await ContactInquiryService.closeInquiry(req.params.id);
  successResponse(res, 'Inquiry closed.', { inquiry });
};

export const deleteContactInquiry = async (req, res) => {
  await ContactInquiryService.deleteInquiry(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
