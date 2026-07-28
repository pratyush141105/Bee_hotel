import HomeContentRepository from '../repositories/homeContent.repository.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util.js';

const HomeContentService = {
  getHome: async () => {
    const content = await HomeContentRepository.get();
    return content || {};
  },

  updateHome: async (data, heroImageFiles) => {
    // If new hero images are uploaded, upload them to Cloudinary
    if (heroImageFiles && heroImageFiles.length > 0) {
      const uploadPromises = heroImageFiles.map((file) =>
        uploadToCloudinary(file.buffer, 'hotel_bee/home')
      );
      const results = await Promise.all(uploadPromises);
      data.heroImages = results.map((r) => r.url);
    }

    const updated = await HomeContentRepository.upsert(data);
    return updated;
  },
};

export default HomeContentService;
