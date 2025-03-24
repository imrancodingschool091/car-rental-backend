import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  modelYear: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  seats: { type: Number, required: true },
  fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric"], required: true },
  transmission: { type: String, enum: ["Manual", "Automatic"], required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

export default mongoose.model('Car', CarSchema);
