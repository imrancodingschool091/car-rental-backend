import Car from '../models/Car.js';
import { uploadOnCloudinary } from '../config/cloudinery.js';

// Create a new car
const createCar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file);
    if (!cloudinaryResponse) {
      return res.status(500).json({ message: 'Image upload failed' });
    }

    const { name, brand, modelYear, pricePerDay, seats, fuelType, transmission, description } = req.body;

    // Validate required fields
    if (!name || !brand || !modelYear || !pricePerDay || !seats || !fuelType || !transmission || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCar = new Car({
      name,
      brand,
      modelYear,
      pricePerDay,
      availability: true,
      seats,
      fuelType,
      transmission,
      description,
      imageUrl: cloudinaryResponse.secure_url, // Store Cloudinary URL
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get all cars
const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars', error: error.message });
  }
};

// Get a single car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Failed to fetch car', error: error.message });
  }
};

// Update a car by ID
const updateCar = async (req, res) => {
  try {
    const { name, brand, modelYear, pricePerDay, seats, fuelType, transmission, description } = req.body;
    let updatedData = { name, brand, modelYear, pricePerDay, seats, fuelType, transmission, description };

    // Check if a new image is uploaded
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file);
      if (!cloudinaryResponse) {
        return res.status(500).json({ message: 'Image upload failed' });
      }
      updatedData.imageUrl = cloudinaryResponse.secure_url;
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Failed to update car', error: error.message });
  }
};

// Delete a car by ID
const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Failed to delete car', error: error.message });
  }
};

export { createCar, getCars, getCarById, updateCar, deleteCar };