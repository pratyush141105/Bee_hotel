import GalleryService from '../services/gallery.service.js';
import { successResponse } from '../utils/response.util.js';
import { MESSAGES } from '../constants/messages.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const listGallery = async (req, res) => {
  const result = await GalleryService.listGallery(req.query);
  successResponse(res, MESSAGES.FETCHED, result);
};

export const uploadMedia = async (req, res) => {
  const item = await GalleryService.uploadMedia(req.body, req.file);
  successResponse(res, MESSAGES.UPLOAD_SUCCESS, { item }, HTTP_STATUS.CREATED);
};

export const updateGalleryItem = async (req, res) => {
  const item = await GalleryService.updateGalleryItem(req.params.id, req.body);
  successResponse(res, MESSAGES.UPDATED, { item });
};

export const deleteGalleryItem = async (req, res) => {
  await GalleryService.deleteGalleryItem(req.params.id);
  successResponse(res, MESSAGES.DELETED);
};
