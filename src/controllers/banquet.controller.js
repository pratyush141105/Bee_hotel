import BanquetHallService from '../services/banquetHall.service.js';
import BanquetBookingService from '../services/banquetBooking.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

// ─── Halls ───────────────────────────────────────────────────

export const listHalls = async (req, res) => {
  const result = await BanquetHallService.listHalls(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getHallById = async (req, res) => {
  const hall = await BanquetHallService.getHallById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { hall });
};

export const createHall = async (req, res) => {
  const hall = await BanquetHallService.createHall(req.body, req.files);
  successResponse(res, MESSAGES.CREATED, { hall }, HTTP_STATUS.CREATED);
};

export const updateHall = async (req, res) => {
  const hall = await BanquetHallService.updateHall(req.params.id, req.body, req.files);
  successResponse(res, MESSAGES.UPDATED, { hall });
};

export const deleteHall = async (req, res) => {
  await BanquetHallService.deleteHall(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};

// ─── Bookings ────────────────────────────────────────────────

export const createBooking = async (req, res) => {
  const booking = await BanquetBookingService.createBooking(req.body);
  successResponse(res, MESSAGES.BOOKING_CREATED, { booking }, HTTP_STATUS.CREATED);
};

export const listBookings = async (req, res) => {
  const result = await BanquetBookingService.listBookings(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const getBookingById = async (req, res) => {
  const booking = await BanquetBookingService.getBookingById(req.params.id);
  successResponse(res, MESSAGES.FETCHED, { booking });
};

export const approveBooking = async (req, res) => {
  const booking = await BanquetBookingService.approveBooking(req.params.id);
  successResponse(res, MESSAGES.BOOKING_APPROVED, { booking });
};

export const rejectBooking = async (req, res) => {
  const booking = await BanquetBookingService.rejectBooking(req.params.id);
  successResponse(res, MESSAGES.BOOKING_REJECTED, { booking });
};

export const completeBooking = async (req, res) => {
  const booking = await BanquetBookingService.completeBooking(req.params.id);
  successResponse(res, MESSAGES.BOOKING_COMPLETED, { booking });
};

export const deleteBooking = async (req, res) => {
  await BanquetBookingService.deleteBooking(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
