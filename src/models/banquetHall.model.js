import mongoose from 'mongoose';

const HALL_STATUS = ['Active', 'Inactive', 'Under Maintenance'];

const banquetHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hall name is required.'],
      trim: true,
      unique: true,
    },
    description: { type: String, trim: true },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required.'],
      min: [1, 'Capacity must be at least 1.'],
    },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String }],
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    status: {
      type: String,
      enum: HALL_STATUS,
      default: 'Active',
    },
  },
  { timestamps: true }
);

const BanquetHall = mongoose.model('BanquetHall', banquetHallSchema);
export default BanquetHall;
