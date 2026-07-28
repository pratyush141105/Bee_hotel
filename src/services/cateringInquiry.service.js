import CateringInquiryRepository from '../repositories/cateringInquiry.repository.js';
import { generateReferenceNumber } from '../utils/referenceNumber.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const CateringInquiryService = {
  /**
   * Public: Submit a catering inquiry. Generates a unique reference number.
   */
  createInquiry: async (data) => {
    data.referenceNumber = generateReferenceNumber('CAT');
    const inquiry = await CateringInquiryRepository.create(data);
    return inquiry;
  },

  listInquiries: async (queryParams) => {
    const { search, status, date } = queryParams;
    const options = buildQueryOptions(queryParams);
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    if (search) {
      const [items, total] = await Promise.all([
        CateringInquiryRepository.search(search, filter, options),
        CateringInquiryRepository.searchCount(search, filter),
      ]);
      return { inquiries: items, pagination: buildPaginationMeta(total, options.page, options.limit) };
    }

    const [inquiries, total] = await Promise.all([
      CateringInquiryRepository.findAll(filter, options),
      CateringInquiryRepository.count(filter),
    ]);
    return { inquiries, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getInquiryById: async (id) => {
    const inquiry = await CateringInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return inquiry;
  },

  confirmInquiry: async (id) => {
    const inquiry = await CateringInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return CateringInquiryRepository.updateStatus(id, 'Confirmed');
  },

  rejectInquiry: async (id) => {
    const inquiry = await CateringInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return CateringInquiryRepository.updateStatus(id, 'Rejected');
  },

  completeInquiry: async (id) => {
    const inquiry = await CateringInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return CateringInquiryRepository.updateStatus(id, 'Completed');
  },

  deleteInquiry: async (id) => {
    const inquiry = await CateringInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    await CateringInquiryRepository.delete(id);
  },
};

export default CateringInquiryService;
