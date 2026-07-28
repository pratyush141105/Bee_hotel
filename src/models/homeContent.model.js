import mongoose from 'mongoose';

const ctaButtonSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    link: { type: String, trim: true },
    variant: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' },
  },
  { _id: false }
);

const featuredSectionSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String },
    link: { type: String, trim: true },
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    heroImages: [{ type: String }],
    tagline: {
      type: String,
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters.'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters.'],
    },
    description: { type: String, trim: true },
    featuredSections: [featuredSectionSchema],
    ctaButtons: [ctaButtonSchema],
  },
  { timestamps: true }
);

const HomeContent = mongoose.model('HomeContent', homeContentSchema);
export default HomeContent;
