import AboutRepository from '../repositories/about.repository.js';

const AboutService = {
  getAbout: async () => {
    const about = await AboutRepository.get();
    return about || {};
  },

  updateAbout: async (data) => {
    const updated = await AboutRepository.upsert(data);
    return updated;
  },
};

export default AboutService;
