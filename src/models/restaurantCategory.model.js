import mongoose from 'mongoose';

const restaurantCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      trim: true,
      unique: true,
      maxlength: [100, 'Category name cannot exceed 100 characters.'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: { type: String },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for sorted listing
restaurantCategorySchema.index({ displayOrder: 1 });

const RestaurantCategory = mongoose.model('RestaurantCategory', restaurantCategorySchema);
export default RestaurantCategory;
