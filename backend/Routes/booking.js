import express from 'express';
import { authenticate } from './../auth/verifyToken.js';
import {
  getCheckoutSession,
  verifyPayment,
  updateBookingStatus,
} from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession);
router.post('/verify-payment', authenticate, verifyPayment);
router.patch('/:bookingId/status', authenticate, updateBookingStatus);

export default router;
