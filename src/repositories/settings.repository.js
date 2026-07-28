import Settings from '../models/settings.model.js';

const SettingsRepository = {
  get: () => Settings.findOne().lean(),

  upsert: (data) =>
    Settings.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true }).lean(),
};

export default SettingsRepository;
