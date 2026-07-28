import multer from 'multer';
import AppError from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

// Use memory storage — files are passed as buffers to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Unsupported file type. Allowed: ${allowedTypes.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      ),
      false
    );
  }
};

/**
 * Upload middleware for single image field.
 * @param {string} fieldName - Form field name.
 */
const uploadSingleImage = (fieldName = 'image') =>
  multer({
    storage,
    fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
    limits: { fileSize: MAX_IMAGE_SIZE },
  }).single(fieldName);

/**
 * Upload middleware for multiple images.
 * @param {string} fieldName - Form field name.
 * @param {number} [maxCount=10] - Max number of files.
 */
const uploadMultipleImages = (fieldName = 'images', maxCount = 10) =>
  multer({
    storage,
    fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
    limits: { fileSize: MAX_IMAGE_SIZE },
  }).array(fieldName, maxCount);

/**
 * Upload middleware for a single image or video (mixed media).
 * @param {string} fieldName
 */
const uploadMedia = (fieldName = 'media') =>
  multer({
    storage,
    fileFilter: fileFilter(ALLOWED_TYPES),
    limits: { fileSize: MAX_VIDEO_SIZE },
  }).single(fieldName);

/**
 * Upload middleware for multiple named fields (e.g. logo + qr on same form).
 * @param {Array<{name: string, maxCount: number}>} fields
 */
const uploadFields = (fields) =>
  multer({
    storage,
    fileFilter: fileFilter(ALLOWED_TYPES),
    limits: { fileSize: MAX_VIDEO_SIZE },
  }).fields(fields);

export { uploadSingleImage, uploadMultipleImages, uploadMedia, uploadFields };
