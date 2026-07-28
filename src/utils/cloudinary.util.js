import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.config.js';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { MESSAGES } from '../constants/messages.constants.js';

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer from Multer memory storage.
 * @param {string} folder - Cloudinary folder to store the file in.
 * @param {string} [resourceType='image'] - 'image' or 'video'.
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(new AppError(MESSAGES.UPLOAD_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    // Convert buffer to readable stream and pipe to Cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary by its public ID.
 * @param {string} publicId - Cloudinary public ID of the asset.
 * @param {string} [resourceType='image'] - 'image' or 'video'.
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    // Log but don't throw — a failed Cloudinary delete should not block DB operations
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, error.message);
  }
};

/**
 * Extracts the Cloudinary public ID from a secure URL.
 * @param {string} url - The full Cloudinary URL.
 * @returns {string} The public ID including folder path.
 */
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  // Skip version segment (v1234567890) if present
  const afterUpload = parts.slice(uploadIndex + 1);
  const withoutVersion = afterUpload[0]?.match(/^v\d+$/)
    ? afterUpload.slice(1)
    : afterUpload;
  const withExtension = withoutVersion.join('/');
  return withExtension.replace(/\.[^/.]+$/, ''); // Remove file extension
};

export { uploadToCloudinary, deleteFromCloudinary, extractPublicId };
