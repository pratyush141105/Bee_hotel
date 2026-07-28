import EventService from '../services/event.service.js';
import EventRegistrationService from '../services/eventRegistration.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

// ─── Events ────────────────────────────────────────────────────

export const listEvents = async (req, res) => {
  const result = await EventService.listEvents(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getFeaturedEvents = async (req, res) => {
  const events = await EventService.getFeaturedEvents();
  successResponse(res, MESSAGES.FETCHED, { events });
};

export const getUpcomingEvents = async (req, res) => {
  const result = await EventService.getUpcomingEvents(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getEventById = async (req, res) => {
  const event = await EventService.getEventById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { event });
};

export const createEvent = async (req, res) => {
  const event = await EventService.createEvent(req.body, req.file);
  successResponse(res, MESSAGES.CREATED, { event }, HTTP_STATUS.CREATED);
};

export const updateEvent = async (req, res) => {
  const event = await EventService.updateEvent(req.params.id, req.body, req.file);
  successResponse(res, MESSAGES.UPDATED, { event });
};

export const deleteEvent = async (req, res) => {
  await EventService.deleteEvent(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};

// ─── Event Registrations ───────────────────────────────────────

export const registerForEvent = async (req, res) => {
  const registration = await EventRegistrationService.registerForEvent(req.params.id, req.body);
  successResponse(res, 'Registration successful.', { registration }, HTTP_STATUS.CREATED);
};

export const checkEventAvailability = async (req, res) => {
  const availability = await EventRegistrationService.checkAvailability(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { availability });
};

export const listRegistrations = async (req, res) => {
  const result = await EventRegistrationService.listRegistrations(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getRegistrationById = async (req, res) => {
  const registration = await EventRegistrationService.getRegistrationById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { registration });
};

export const confirmRegistration = async (req, res) => {
  const registration = await EventRegistrationService.confirmRegistration(req.params.id);
  successResponse(res, 'Registration confirmed.', { registration });
};

export const cancelRegistration = async (req, res) => {
  const registration = await EventRegistrationService.cancelRegistration(req.params.id);
  successResponse(res, 'Registration cancelled.', { registration });
};

export const deleteRegistration = async (req, res) => {
  await EventRegistrationService.deleteRegistration(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
