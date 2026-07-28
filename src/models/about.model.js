import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    description: { type: String, trim: true },
    since: {
      type: Number,
      min: [1800, 'Year seems invalid.'],
      max: [new Date().getFullYear(), 'Year cannot be in the future.'],
    },
    mission: { type: String, trim: true },
    vision: { type: String, trim: true },
    services: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const About = mongoose.model('About', aboutSchema);
export default About;
