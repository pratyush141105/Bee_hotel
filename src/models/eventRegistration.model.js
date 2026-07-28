import mongoose from 'mongoose';

const REGISTRATION_STATUS = ['Pending', 'Confirmed', 'Cancelled', 'Attended'];

const eventRegistrationSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      unique: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required.'],
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
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required.'],
      min: [1, 'At least 1 guest is required.'],
      default: 1,
    },
    specialRequest: {
      type: String,
      trim: true,
      maxlength: [500, 'Special request cannot exceed 500 characters.'],
    },
    status: {
      type: String,
      enum: REGISTRATION_STATUS,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ eventId: 1 });
eventRegistrationSchema.index({ status: 1 });
eventRegistrationSchema.index({ email: 1 });
eventRegistrationSchema.index({ customerName: 'text', email: 'text', referenceNumber: 'text' });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
export default EventRegistration;
