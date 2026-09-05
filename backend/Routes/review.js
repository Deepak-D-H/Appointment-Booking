import express from 'express'

import { createReview,getAllReviews } from '../Controllers/reviewController.js'

import { authenticate,restrict } from '../auth/verifyToken.js'

const router = express.Router({mergeParams:true})


//doctor/doctorId/reviews
// router.route('/').get(getAllReviews).post(authenticate,restrict(['patient'],createReview))

// .route() is just another way of writing multiple routes (GET, POST, PUT, DELETE) for the same URL.
router.route('/')
  .get(getAllReviews)
  .post(
    authenticate,               // user must be logged in
    restrict(['patient']),       // only patient can post reviews
    createReview                 // function to create review
  );

export default router;