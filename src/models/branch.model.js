import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: [true, 'Branch name is required.'],
      trim: true,
      maxlength: [150, 'Branch name cannot exceed 150 characters.'],
    },
    address: {
      type: String,
      required: [true, 'Address is required.'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
    },
    map: { type: String, trim: true },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

branchSchema.index({ isActive: 1 });

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;
