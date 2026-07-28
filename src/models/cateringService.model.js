import mongoose from 'mongoose';

const cateringServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required.'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters.'],
    },
    description: { type: String, trim: true },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative.'],
    },
    images: [{ type: String }],
    features: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const CateringService = mongoose.model('CateringService', cateringServiceSchema);
export default CateringService;
