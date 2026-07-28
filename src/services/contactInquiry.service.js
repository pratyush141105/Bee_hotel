import ContactInquiryRepository from '../repositories/contactInquiry.repository.js';
import { generateReferenceNumber } from '../utils/referenceNumber.util.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const ContactInquiryService = {
  /**
   * Public: Submit a contact form message.
   */
  createInquiry: async (data) => {
    data.referenceNumber = generateReferenceNumber('CNT');
    return ContactInquiryRepository.create(data);
  },

  listInquiries: async (queryParams) => {
    const { search, status } = queryParams;
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (status) filter.status = status;

    if (search) {
      const [items, total] = await Promise.all([
        ContactInquiryRepository.search(search, filter, options),
        ContactInquiryRepository.searchCount(search, filter),
      ]);
      return { inquiries: items, pagination: buildPaginationMeta(total, options.page, options.limit) };
    }

    const [inquiries, total] = await Promise.all([
      ContactInquiryRepository.findAll(filter, options),
      ContactInquiryRepository.count(filter),
    ]);
    return { inquiries, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getInquiryById: async (id) => {
    const inquiry = await ContactInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return inquiry;
  },

  markAsRead: async (id) => {
    const inquiry = await ContactInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return ContactInquiryRepository.updateStatus(id, 'Read');
  },

  closeInquiry: async (id) => {
    const inquiry = await ContactInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return ContactInquiryRepository.updateStatus(id, 'Closed');
  },

  deleteInquiry: async (id) => {
    const inquiry = await ContactInquiryRepository.findById(id);
    if (!inquiry) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    await ContactInquiryRepository.delete(id);
  },
};

export default ContactInquiryService;
