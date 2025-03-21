import express from 'express';
import { upload } from '../middleware/upload.js';
import { createCar, getCars } from '../controllers/carController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), createCar);
router.get('/', getCars);

export default router;