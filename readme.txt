https://car-rental-backend-1-7ej4.onrender.com/api/cars

https://car-rental-backend-1-7ej4.onrender.com/api/auth/register
https://car-rental-backend-1-7ej4.onrender.com/api/auth/login
https://car-rental-backend-1-7ej4.onrender.com/api/bookings




//booking model 

import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    totalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "pending" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "failed"], 
      default: "pending" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
