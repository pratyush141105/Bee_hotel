import DashboardService from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';

export const getOverview = async (req, res) => {
  const overview = await DashboardService.getOverview();
  successResponse(res, MESSAGES.FETCHED, { overview });
};

export const getBookingStats = async (req, res) => {
  const stats = await DashboardService.getBookingStats();
  successResponse(res, MESSAGES.FETCHED, { stats });
};

export const getRevenueStats = async (req, res) => {
  const revenue = await DashboardService.getRevenueStats();
  successResponse(res, MESSAGES.FETCHED, { revenue });
};

export const getRecentActivity = async (req, res) => {
  const activity = await DashboardService.getRecentActivity();
  successResponse(res, MESSAGES.FETCHED, { activity });
};

export const getChartData = async (req, res) => {
  const charts = await DashboardService.getChartData();
  successResponse(res, MESSAGES.FETCHED, { charts });
};
