import express from 'express';
import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
} from '../Controllers/doctorController.js';

import { authenticate, restrict } from '../auth/verifyToken.js';
import reviewRoute from './review.js';

const router = express.Router();

// Nested reviews route
router.use('/:doctorId/reviews', reviewRoute);

// Specific routes MUST be declared before dynamic parameter routes (/:id)
router.get('/', getAllDoctor);
router.get('/profile/me', authenticate, restrict(['doctor']), getDoctorProfile);

// Dynamic routes by doctor id
router.get('/:id', getSingleDoctor);
router.put('/:id', authenticate, restrict(['doctor', 'admin']), updateDoctor);
router.delete('/:id', authenticate, restrict(['doctor', 'admin']), deleteDoctor);

export default router;