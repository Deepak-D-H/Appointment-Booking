import Booking from '../models/BookingSchema.js';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';
import Stripe from 'stripe';

export const getCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Stripe secret key is not configured on the server',
      });
    }

    // Prefer request origin so success/cancel URLs match running frontend
    let clientUrl = req.headers.origin || process.env.CLIENT_SITE_URL || 'http://localhost:5173';
    clientUrl = clientUrl.replace(/\/+$/, '');
    const currency = process.env.STRIPE_CURRENCY || 'inr';

    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Determine ticket price; fall back to DEFAULT_TICKET_PRICE if missing/invalid
    let price = Number(doctor.ticketPrice);
    if (!doctor.ticketPrice || isNaN(price)) {
      const fallback = Number(process.env.DEFAULT_TICKET_PRICE) || 100;
      console.warn(`doctor.ticketPrice missing or invalid for ${doctor._id}; using fallback ${fallback}`);
      price = fallback;
    }

    if (price < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum appointment fee must be 10 INR',
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      // Include session_id template so frontend can verify on checkout-success
      success_url: `${clientUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/doctors/${doctor._id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      metadata: {
        userId: user._id.toString(),
        doctorId: doctor._id.toString(),
      },
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(price * 100),
            product_data: {
              name: doctor.name,
              description: doctor.bio || 'Doctor consultation appointment',
              images: doctor.photo ? [doctor.photo] : [],
            },
          },
          quantity: 1,
        },
      ],
    });

    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: price,
      appointmentDate: req.body.appointmentDate || Date.now(),
      isPaid: false,
      session: session.id,
    });

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Checkout session created',
      session,
    });
  } catch (error) {
    console.error('getCheckoutSession error ->', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const sessionId = req.body?.sessionId || req.body?.session_id || req.query?.session_id;

    let booking;
    if (sessionId) {
      booking = await Booking.findOne({ session: sessionId });
    }

    // Fallback: If no sessionId or not found, check the user's latest booking
    if (!booking && req.userId) {
      booking = await Booking.findOne({ user: req.userId }).sort({ createdAt: -1 });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No booking found to verify',
      });
    }

    // If already marked paid, return success immediately
    if (booking.isPaid) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified and appointment is confirmed',
        data: booking,
      });
    }

    // Check with Stripe if session ID starts with cs_
    if (process.env.STRIPE_SECRET_KEY && booking.session && booking.session.startsWith('cs_')) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(booking.session);

      if (session.payment_status === 'paid' || session.status === 'complete') {
        booking.isPaid = true;
        booking.status = 'approved';
        await booking.save();

        return res.status(200).json({
          success: true,
          message: 'Payment successfully verified and appointment approved',
          data: booking,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verification checked',
      data: booking,
    });
  } catch (error) {
    console.error('verifyPayment error ->', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { isPaid, status } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Doctor of booking or Admin can update
    const doctorIdStr = booking.doctor?._id?.toString() || booking.doctor?.toString();
    const isDoctor = req.userId === doctorIdStr;
    const isAdmin = req.role === 'admin';

    if (!isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update booking status',
      });
    }

    if (typeof isPaid === 'boolean') {
      booking.isPaid = isPaid;
      if (isPaid && booking.status === 'pending') {
        booking.status = 'approved';
      }
    }

    if (status && ['pending', 'approved', 'cancelled'].includes(status)) {
      booking.status = status;
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('updateBookingStatus error ->', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message,
    });
  }
};
