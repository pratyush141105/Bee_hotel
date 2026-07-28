import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [1, 'Rating must be between 1 and 5.'],
      max: [5, 'Rating must be between 1 and 5.'],
    },
    review: {
      type: String,
      required: [true, 'Review text is required.'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters.'],
    },
    approved: {
      type: Boolean,
      default: false, // Requires admin approval before appearing publicly
    },
  },
  { timestamps: true }
);

// Indexes for filtering
reviewSchema.index({ approved: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ customerName: 'text', review: 'text' });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
