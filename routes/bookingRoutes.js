import express from 'express';
import { createBooking,getAllBookings,getBookingById,deleteAllBookings,deleteBooking,updateBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
