import mongoose from 'mongoose';
import { BOOKING_STATUS, BOOKING_STATUS_VALUES } from '../constants/booking.constants.js';

const banquetBookingSchema = new mongoose.Schema(
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
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BanquetHall',
      required: [true, 'Hall selection is required.'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required.'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required.'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required.'],
      trim: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required.'],
      min: [1, 'At least 1 guest is required.'],
    },
    foodRequirement: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: BOOKING_STATUS_VALUES,
      default: BOOKING_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

// Indexes for filtering
banquetBookingSchema.index({ status: 1 });
banquetBookingSchema.index({ hall: 1 });
banquetBookingSchema.index({ date: 1 });
banquetBookingSchema.index({ email: 1 });

const BanquetBooking = mongoose.model('BanquetBooking', banquetBookingSchema);
export default BanquetBooking;
