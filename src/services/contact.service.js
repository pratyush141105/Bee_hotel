import ContactRepository from '../repositories/contact.repository.js';

const ContactService = {
  getContact: async () => {
    const contact = await ContactRepository.get();
    return contact || {};
  },

  updateContact: async (data) => {
    return ContactRepository.upsert(data);
  },
};

export default ContactService;
