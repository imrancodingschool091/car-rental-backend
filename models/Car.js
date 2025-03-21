import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
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
});

const Car = mongoose.model("Car", carSchema);

export default Car;
