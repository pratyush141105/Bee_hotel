import AppError from '../errors/AppError.js';
import { verifyToken } from '../utils/jwt.util.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';
import AdminRepository from '../repositories/admin.repository.js';
import env from '../config/env.config.js';

/**
 * Middleware: Authenticate Super Admin
 * Reads JWT from HTTP-only cookie → verifies → attaches admin to req.admin
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.[env.cookie.name];

    if (!token) {
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = verifyToken(token);

    const admin = await AdminRepository.findById(decoded.adminId);
    if (!admin) {
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    // Attach admin info to request (exclude password)
    req.admin = {
      adminId: admin._id,
      email: admin.email,
      name: admin.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export { authenticateAdmin };
