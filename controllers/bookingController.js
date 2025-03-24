import Booking from "../models/Booking.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { user, car, startDate, endDate, totalPrice } = req.body;
    
    if (!user || !car || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (totalDays < 1) {
      return res.status(400).json({ error: "Total days must be at least 1" });
    }

    const booking = new Booking({
      user,
      car,
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

// Get all bookings for a user
export const getMyBookings = async (req, res) => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("car", "name brand modelYear pricePerDay")
      .populate("user", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("car", "name brand modelYear pricePerDay")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Server error while fetching booking" });
  }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, totalPrice, status, paymentStatus } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (startDate) booking.startDate = new Date(startDate);
    if (endDate) booking.endDate = new Date(endDate);
    if (totalPrice !== undefined) booking.totalPrice = totalPrice;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    if (booking.startDate && booking.endDate) {
      booking.totalDays = Math.ceil(
        (booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24)
      );
      if (booking.totalDays < 1) {
        return res.status(400).json({ error: "Total days must be at least 1" });
      }
    }

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Server error while updating booking" });
  }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Server error while deleting booking" });
  }
};
