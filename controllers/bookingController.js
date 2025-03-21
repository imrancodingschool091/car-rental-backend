import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js"; // Ensure User model exists

// ✅ CREATE Booking
export const createBooking = async (req, res) => {
  try {
    const { userId, carId, startDate, endDate, totalPrice } = req.body;

    // Validate required fields
    if (!userId || !carId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    // Calculate total days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // Check if car is already booked for the selected dates
    const existingBooking = await Booking.findOne({
      car: carId,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ error: "Car is already booked for the selected dates" });
    }

    // Create and save booking
    const booking = new Booking({
      user: userId,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Server error while creating booking" });
  }
};

// ✅ GET All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("car", "brand model pricePerDay");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
};

// ✅ GET Booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("car", "brand model pricePerDay");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Server error while fetching booking" });
  }
};

// ✅ UPDATE Booking
export const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate, totalPrice, status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Validate and update fields
    if (startDate) booking.startDate = new Date(startDate);
    if (endDate) booking.endDate = new Date(endDate);
    if (totalPrice) booking.totalPrice = totalPrice;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    // Recalculate totalDays if dates change
    if (startDate || endDate) {
      booking.totalDays = Math.ceil((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24));
    }

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Server error while updating booking" });
  }
};

// ✅ DELETE Booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Server error while deleting booking" });
  }
};

// ✅ DELETE All Bookings (Optional)
export const deleteAllBookings = async (req, res) => {
  try {
    await Booking.deleteMany();
    res.status(200).json({ message: "All bookings deleted successfully" });
  } catch (error) {
    console.error("Error deleting all bookings:", error);
    res.status(500).json({ error: "Server error while deleting all bookings" });
  }
};
