import SettingsRepository from '../repositories/settings.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';

const SettingsService = {
  getSettings: async () => {
    const settings = await SettingsRepository.get();
    return settings || {};
  },

  updateSettings: async (data) => {
    return SettingsRepository.upsert(data);
  },

  updateLogo: async (file) => {
    const existing = await SettingsRepository.get();
    if (existing?.logo) {
      await deleteFromCloudinary(extractPublicId(existing.logo));
    }
    const { url } = await uploadToCloudinary(file.buffer, 'hotel_bee/settings');
    return SettingsRepository.upsert({ logo: url });
  },

  updateQR: async (file) => {
    const existing = await SettingsRepository.get();
    if (existing?.restaurantQR) {
      await deleteFromCloudinary(extractPublicId(existing.restaurantQR));
    }
    const { url } = await uploadToCloudinary(file.buffer, 'hotel_bee/settings');
    return SettingsRepository.upsert({ restaurantQR: url });
  },
};

export default SettingsService;
