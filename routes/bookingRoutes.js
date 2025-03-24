import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getBookingById, 
  deleteBooking, 
  updateBooking 
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:id', getMyBookings); // Fix: Route to fetch bookings by user
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
