import { Router } from 'express';
import authRoutes from './auth.routes.js';
import homeRoutes from './home.routes.js';
import aboutRoutes from './about.routes.js';
import restaurantRoutes from './restaurant.routes.js';
import banquetRoutes from './banquet.routes.js';
import cateringRoutes from './catering.routes.js';
import galleryRoutes from './gallery.routes.js';
import reviewRoutes from './review.routes.js';
import eventRoutes from './event.routes.js';
import managerRoutes from './manager.routes.js';
import branchRoutes from './branch.routes.js';
import contactRoutes from './contact.routes.js';
import settingsRoutes from './settings.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Hotel Bee API is running.', timestamp: new Date().toISOString() });
});

// Feature routes
router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/about', aboutRoutes);
router.use('/restaurant', restaurantRoutes);
router.use('/banquet', banquetRoutes);
router.use('/catering', cateringRoutes);
router.use('/gallery', galleryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/events', eventRoutes);
router.use('/managers', managerRoutes);
router.use('/branches', branchRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
