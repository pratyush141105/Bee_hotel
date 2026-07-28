import mongoose from 'mongoose';

const workingHoursSchema = new mongoose.Schema(
  {
    day: { type: String, trim: true },
    hours: { type: String, trim: true },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    hotelName: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: [{ type: String, trim: true }],
    email: [{ type: String, trim: true }],
    googleMap: { type: String, trim: true },
    workingHours: [workingHoursSchema],
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
