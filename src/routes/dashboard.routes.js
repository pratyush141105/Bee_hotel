import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// All dashboard routes are admin-protected
router.use(authenticateAdmin);

router.get('/overview', dashboardController.getOverview);
router.get('/bookings', dashboardController.getBookingStats);
router.get('/revenue', dashboardController.getRevenueStats);
router.get('/recent', dashboardController.getRecentActivity);
router.get('/charts', dashboardController.getChartData);

export default router;
