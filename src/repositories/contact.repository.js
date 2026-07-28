import Contact from '../models/contact.model.js';

const ContactRepository = {
  get: () => Contact.findOne().lean(),

  upsert: (data) =>
    Contact.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true }).lean(),
};

export default ContactRepository;
