import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Manager name is required.'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    department: {
      type: String,
      required: [true, 'Department is required.'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
