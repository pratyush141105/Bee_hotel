import mongoose from 'mongoose';

const GALLERY_TYPES = ['image', 'video'];

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    type: {
      type: String,
      enum: GALLERY_TYPES,
      required: [true, 'Media type (image/video) is required.'],
    },
    url: {
      type: String,
      required: [true, 'Media URL is required.'],
    },
    category: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for filtering and sorting
gallerySchema.index({ type: 1 });
gallerySchema.index({ category: 1 });
gallerySchema.index({ displayOrder: 1 });
gallerySchema.index({ title: 'text' }); // Text search

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
