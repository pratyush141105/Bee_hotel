import mongoose from 'mongoose';

const INQUIRY_STATUS = ['Unread', 'Read', 'Closed'];

const contactInquirySchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: [true, 'Email is required.'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required.'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters.'],
    },
    message: {
      type: String,
      required: [true, 'Message is required.'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters.'],
    },
    status: {
      type: String,
      enum: INQUIRY_STATUS,
      default: 'Unread',
    },
  },
  { timestamps: true }
);

contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ customerName: 'text', email: 'text', subject: 'text', referenceNumber: 'text' });

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
export default ContactInquiry;
