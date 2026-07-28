import mongoose from 'mongoose';

const INQUIRY_STATUS = ['Pending', 'Confirmed', 'Rejected', 'Completed'];

const cateringInquirySchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters.'],
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
    eventDate: {
      type: Date,
      required: [true, 'Event date is required.'],
    },
    eventTime: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required.'],
      trim: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required.'],
      min: [1, 'At least 1 guest is required.'],
    },
    selectedPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CateringService',
    },
    foodRequirements: {
      type: String,
      trim: true,
    },
    additionalRequirements: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: INQUIRY_STATUS,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Indexes for admin filtering
cateringInquirySchema.index({ status: 1 });
cateringInquirySchema.index({ eventDate: 1 });
cateringInquirySchema.index({ email: 1 });
cateringInquirySchema.index({ customerName: 'text', email: 'text', referenceNumber: 'text' });

const CateringInquiry = mongoose.model('CateringInquiry', cateringInquirySchema);
export default CateringInquiry;
