import express from 'express';
import { upload } from '../middleware/upload.js';
import { 
  createCar, 
  getCars, 
  getCarById, 
  updateCar, 
  deleteCar 
} from '../controllers/carController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new car
router.post('/', authenticate, upload.single('image'), createCar);

// Get all cars
router.get('/', getCars);

// Get a single car by ID
router.get('/:id', getCarById);

// Update a car
router.put('/:id', authenticate, upload.single('image'), updateCar);

// Delete a car
router.delete('/:id', authenticate, deleteCar);

export default router;