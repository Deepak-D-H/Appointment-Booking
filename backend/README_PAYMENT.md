Stripe payment integration notes

- Install Stripe in the backend folder:

  npm install stripe

- Required environment variables (add to your `.env`):

  STRIPE_SECRET_KEY=sk_test_...   # Your Stripe secret key
  CLIENT_SITE_URL=http://localhost:5173  # or your frontend URL

- Endpoint

  POST /api/v1/bookings/checkout-session/:doctorId

  Headers:
    Authorization: Bearer <JWT token>
    Content-Type: application/json

  Body (optional):
    {
      "appointmentDate": "2025-12-10T10:00:00.000Z"
    }

  Response: JSON with `session` object returned from Stripe. Use the `session.id` on the frontend to redirect to Stripe Checkout.

- Notes:
  - A booking record is created when the checkout session is made. It is marked `isPaid: false` until you confirm payment via Stripe webhook.
  - For production, configure a Stripe webhook to listen for `checkout.session.completed` and mark the corresponding booking `isPaid: true`.
