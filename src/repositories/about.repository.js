import About from '../models/about.model.js';

const AboutRepository = {
  get: () => About.findOne().lean(),

  upsert: (data) =>
    About.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true }).lean(),
};

export default AboutRepository;
