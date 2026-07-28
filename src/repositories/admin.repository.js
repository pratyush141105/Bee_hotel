import Admin from '../models/admin.model.js';

const AdminRepository = {
  /**
   * Find admin by ID (without password).
   */
  findById: (id) => Admin.findById(id).select('-password').lean(),

  /**
   * Find admin by ID, explicitly including password for auth comparison.
   */
  findByIdWithPassword: (id) => Admin.findById(id).select('+password'),

  /**
   * Find admin by email (without password).
   */
  findByEmail: (email) => Admin.findOne({ email: email.toLowerCase() }).lean(),

  /**
   * Find admin by email, explicitly including password for login.
   */
  findByEmailWithPassword: (email) =>
    Admin.findOne({ email: email.toLowerCase() }).select('+password'),

  /**
   * Create a new admin record.
   */
  create: (data) => Admin.create(data),

  /**
   * Update an admin by ID.
   */
  update: (id, data) =>
    Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),
};

export default AdminRepository;
