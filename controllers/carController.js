import Car from '../models/Car.js';
import { uploadOnCloudinary } from '../config/cloudinery.js';

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

const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars', error: error.message });
  }
};

export { createCar, getCars };