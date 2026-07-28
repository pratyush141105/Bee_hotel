import BranchRepository from '../repositories/branch.repository.js';
import { buildQueryOptions, buildPaginationMeta } from '../utils/pagination.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const BranchService = {
  listBranches: async (queryParams) => {
    const options = buildQueryOptions(queryParams);
    const filter = {};
    if (queryParams.isActive !== undefined) filter.isActive = queryParams.isActive === 'true';

    const [branches, total] = await Promise.all([
      BranchRepository.findAll(filter, options),
      BranchRepository.count(filter),
    ]);
    return { branches, pagination: buildPaginationMeta(total, options.page, options.limit) };
  },

  getBranchById: async (id) => {
    const branch = await BranchRepository.findById(id);
    if (!branch) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return branch;
  },

  createBranch: async (data) => BranchRepository.create(data),

  updateBranch: async (id, data) => {
    const existing = await BranchRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return BranchRepository.update(id, data);
  },

  deleteBranch: async (id) => {
    const existing = await BranchRepository.findById(id);
    if (!existing) throw new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    await BranchRepository.delete(id);
  },
};

export default BranchService;
