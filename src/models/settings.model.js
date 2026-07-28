import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    restaurantQR: { type: String },  // Cloudinary URL of QR code image
    swiggyLink: { type: String, trim: true },
    zomatoLink: { type: String, trim: true },
    darkModeDefault: {
      type: Boolean,
      default: false,
    },
    websiteTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Website title cannot exceed 200 characters.'],
    },
    logo: { type: String }, // Cloudinary URL
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
