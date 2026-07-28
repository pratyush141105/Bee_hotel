import AdminRepository from '../repositories/admin.repository.js';
import { signToken } from '../utils/jwt.util.js';
import { setCookie, clearCookie } from '../utils/cookie.util.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

const AuthService = {
  /**
   * Authenticates admin credentials and sets the auth cookie.
   */
  login: async (res, { email, password }) => {
    const admin = await AdminRepository.findByEmailWithPassword(email);
    if (!admin) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = signToken({ adminId: admin._id, email: admin.email });
    setCookie(res, token);

    return {
      adminId: admin._id,
      name: admin.name,
      email: admin.email,
    };
  },

  /**
   * Clears the auth cookie to log out the admin.
   */
  logout: (res) => {
    clearCookie(res);
  },

  /**
   * Returns the current authenticated admin's profile.
   */
  getCurrentAdmin: async (adminId) => {
    const admin = await AdminRepository.findById(adminId);
    if (!admin) {
      throw new AppError(MESSAGES.ADMIN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return admin;
  },

  /**
   * Updates admin profile fields (name, email).
   */
  updateProfile: async (adminId, data) => {
    const updated = await AdminRepository.update(adminId, data);
    if (!updated) {
      throw new AppError(MESSAGES.ADMIN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return updated;
  },

  /**
   * Validates current password then updates to new password.
   */
  changePassword: async (adminId, { currentPassword, newPassword }) => {
    const admin = await AdminRepository.findByIdWithPassword(adminId);
    if (!admin) {
      throw new AppError(MESSAGES.ADMIN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError(MESSAGES.INCORRECT_PASSWORD, HTTP_STATUS.BAD_REQUEST);
    }

    // Update password — the pre-save hook in the model will hash it
    admin.password = newPassword;
    await admin.save();
  },
};

export default AuthService;
