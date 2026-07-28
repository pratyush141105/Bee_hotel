import BanquetBooking from '../models/banquetBooking.model.js';
import BanquetHall from '../models/banquetHall.model.js';
import Review from '../models/review.model.js';
import Gallery from '../models/gallery.model.js';
import MenuItem from '../models/menuItem.model.js';
import RestaurantCategory from '../models/restaurantCategory.model.js';
import Event from '../models/event.model.js';
import Manager from '../models/manager.model.js';
import Branch from '../models/branch.model.js';
import CateringService from '../models/cateringService.model.js';
import CateringInquiry from '../models/cateringInquiry.model.js';
import ContactInquiry from '../models/contactInquiry.model.js';
import EventRegistration from '../models/eventRegistration.model.js';

const DashboardService = {
  /**
   * GET /dashboard/overview
   * Aggregate counts across all major entities.
   */
  getOverview: async () => {
    const now = new Date();

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalEvents,
      upcomingEvents,
      totalReviews,
      approvedReviews,
      totalGalleryItems,
      totalRestaurantItems,
      totalCategories,
      totalBanquetHalls,
      totalBranches,
      totalManagers,
      totalCateringServices,
      totalCateringInquiries,
      pendingCateringInquiries,
      totalContactInquiries,
      unreadContactInquiries,
      totalEventRegistrations,
      pendingEventRegistrations,
    ] = await Promise.all([
      BanquetBooking.countDocuments(),
      BanquetBooking.countDocuments({ status: 'Pending' }),
      BanquetBooking.countDocuments({ status: 'Confirmed' }),
      BanquetBooking.countDocuments({ status: 'Completed' }),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: now } }),
      Review.countDocuments(),
      Review.countDocuments({ approved: true }),
      Gallery.countDocuments(),
      MenuItem.countDocuments(),
      RestaurantCategory.countDocuments(),
      BanquetHall.countDocuments(),
      Branch.countDocuments(),
      Manager.countDocuments(),
      CateringService.countDocuments(),
      CateringInquiry.countDocuments(),
      CateringInquiry.countDocuments({ status: 'Pending' }),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: 'Unread' }),
      EventRegistration.countDocuments(),
      EventRegistration.countDocuments({ status: 'Pending' }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalEvents,
      upcomingEvents,
      totalReviews,
      approvedReviews,
      pendingReviews: totalReviews - approvedReviews,
      totalGalleryItems,
      totalRestaurantItems,
      totalCategories,
      totalBanquetHalls,
      totalBranches,
      totalManagers,
      totalCateringServices,
      totalCateringInquiries,
      pendingCateringInquiries,
      totalContactInquiries,
      unreadContactInquiries,
      totalEventRegistrations,
      pendingEventRegistrations,
    };
  },

  /**
   * GET /dashboard/bookings
   * Booking trends and status distribution.
   */
  getBookingStats: async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const [
      monthlyBookings,
      weeklyBookings,
      dailyBookings,
      statusDistribution,
      monthlyTrend,
    ] = await Promise.all([
      BanquetBooking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      BanquetBooking.countDocuments({ createdAt: { $gte: startOfWeek } }),
      BanquetBooking.countDocuments({ createdAt: { $gte: startOfDay } }),

      // Status distribution for pie chart
      BanquetBooking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
      ]),

      // Monthly booking trend for the last 12 months
      BanquetBooking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            count: 1,
          },
        },
      ]),
    ]);

    return {
      monthlyBookings,
      weeklyBookings,
      dailyBookings,
      statusDistribution,
      monthlyTrend,
    };
  },

  /**
   * GET /dashboard/revenue
   * Future-ready revenue estimates from confirmed/completed bookings.
   */
  getRevenueStats: async () => {
    const revenueData = await BanquetBooking.aggregate([
      {
        $match: { status: { $in: ['Confirmed', 'Completed'] } },
      },
      {
        $lookup: {
          from: 'banquethalls',
          localField: 'hall',
          foreignField: '_id',
          as: 'hallData',
        },
      },
      { $unwind: { path: '$hallData', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: null,
          estimatedRevenue: { $sum: '$hallData.pricePerDay' },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] },
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
        },
      },
    ]);

    const monthlyRevenue = await BanquetBooking.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      {
        $lookup: {
          from: 'banquethalls',
          localField: 'hall',
          foreignField: '_id',
          as: 'hallData',
        },
      },
      { $unwind: { path: '$hallData', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          revenue: { $sum: '$hallData.pricePerDay' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, year: '$_id.year', month: '$_id.month', revenue: 1, count: 1 } },
    ]);

    return {
      estimatedRevenue: revenueData[0]?.estimatedRevenue || 0,
      confirmedBookingsRevenue: revenueData[0]?.estimatedRevenue || 0,
      monthlyRevenue,
    };
  },

  /**
   * GET /dashboard/recent
   * Latest activity across all modules.
   */
  getRecentActivity: async () => {
    const [
      latestBookings,
      latestReviews,
      latestContactInquiries,
      latestCateringInquiries,
      latestEventRegistrations,
    ] = await Promise.all([
      BanquetBooking.find().sort({ createdAt: -1 }).limit(5).populate('hall', 'name').lean(),
      Review.find().sort({ createdAt: -1 }).limit(5).lean(),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      CateringInquiry.find().sort({ createdAt: -1 }).limit(5).populate('selectedPackage', 'name').lean(),
      EventRegistration.find().sort({ createdAt: -1 }).limit(5).populate('eventId', 'title date').lean(),
    ]);

    return {
      latestBookings,
      latestReviews,
      latestContactInquiries,
      latestCateringInquiries,
      latestEventRegistrations,
    };
  },

  /**
   * GET /dashboard/charts
   * MongoDB aggregation data for frontend charts.
   */
  getChartData: async () => {
    const [
      bookingTrend,
      bookingStatusPie,
      eventCategories,
      cateringInquiryTrend,
      contactInquiryTrend,
      reviewRatings,
    ] = await Promise.all([
      // Monthly booking trend (last 12 months)
      BanquetBooking.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) },
          },
        },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', count: 1 } },
      ]),

      // Booking status pie chart
      BanquetBooking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),

      // Popular event categories
      Event.aggregate([
        { $match: { category: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, category: '$_id', count: 1 } },
      ]),

      // Catering inquiry trend (last 6 months)
      CateringInquiry.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) },
          },
        },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', count: 1 } },
      ]),

      // Contact inquiry trend (last 6 months)
      ContactInquiry.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) },
          },
        },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $project: { _id: 0, year: '$_id.year', month: '$_id.month', count: 1 } },
      ]),

      // Review ratings distribution
      Review.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, rating: '$_id', count: 1 } },
      ]),
    ]);

    return {
      bookingTrend,
      bookingStatusPie,
      eventCategories,
      cateringInquiryTrend,
      contactInquiryTrend,
      reviewRatings,
    };
  },
};

export default DashboardService;
