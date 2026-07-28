import ManagerRepository from '../repositories/manager.repository.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const ManagerService = {
  listManagers: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const [managers, total] = await Promise.all([
      ManagerRepository.findAll({}, options),
      ManagerRepository.count({}),
    ]);
    return { managers, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getManagerById: async (id) => {
    const manager = await ManagerRepository.findById(id);
    if (!manager) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return manager;
  },

  createManager: async (data) => ManagerRepository.create(data),

  updateManager: async (id, data) => {
    const existing = await ManagerRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return ManagerRepository.update(id, data);
  },

  deleteManager: async (id) => {
    const existing = await ManagerRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    await ManagerRepository.delete(id);
  },
};

export default ManagerService;
