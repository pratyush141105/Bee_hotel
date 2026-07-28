import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    description: { type: String, trim: true },
    banner: { type: String },
    date: {
      type: Date,
      required: [true, 'Event date is required.'],
    },
    time: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // ─── Registration Fields ──────────────────────────────────
    registrationEnabled: {
      type: Boolean,
      default: false,
    },
    maximumGuests: {
      type: Number,
      default: 0, // 0 = unlimited
      min: [0, 'Maximum guests cannot be negative.'],
    },
    registeredGuests: {
      type: Number,
      default: 0,
      min: [0, 'Registered guests cannot be negative.'],
    },
    registrationDeadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Virtual: isFull — true when maximumGuests > 0 and registeredGuests >= maximumGuests
eventSchema.virtual('isFull').get(function () {
  if (!this.maximumGuests || this.maximumGuests === 0) return false;
  return this.registeredGuests >= this.maximumGuests;
});

// Include virtuals in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Indexes for filtering upcoming and featured events
eventSchema.index({ date: 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ title: 'text', description: 'text' });

const Event = mongoose.model('Event', eventSchema);
export default Event;
