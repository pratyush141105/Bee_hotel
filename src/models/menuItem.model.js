import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required.'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    image: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantCategory',
      required: [true, 'Category is required.'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    veg: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for filtering and searching
menuItemSchema.index({ categoryId: 1 });
menuItemSchema.index({ veg: 1 });
menuItemSchema.index({ featured: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' }); // Text search

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
