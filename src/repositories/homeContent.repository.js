import HomeContent from '../models/homeContent.model.js';

const HomeContentRepository = {
  /**
   * Get the single home content document (singleton pattern).
   */
  get: () => HomeContent.findOne().lean(),

  /**
   * Update the home content or create it if it doesn't exist.
   */
  upsert: (data) =>
    HomeContent.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true }).lean(),
};

export default HomeContentRepository;
