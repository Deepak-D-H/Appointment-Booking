import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  // Authorization check: doctor can only update their own profile unless admin
  if (req.userId !== id && req.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to update this doctor profile' });
  }

  try {
    const updateData = { ...req.body };

    // Prevent non-admin from approving themselves or modifying role
    if (req.role !== 'admin') {
      delete updateData.isApproved;
      delete updateData.role;
    }

    // Handle password update if provided
    if (updateData.password && updateData.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated',
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update Doctor' });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  // Authorization check
  if (req.userId !== id && req.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to delete this doctor profile' });
  }

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete Doctor' });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate('reviews')
      .select('-password');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    res.status(200).json({ success: true, message: 'Doctor found', data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: 'No doctor found' });
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;

    // Filter by approval status or show all non-cancelled doctors if pending
    let filter = { isApproved: { $ne: 'cancelled' } };

    if (query && query.trim() !== '') {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: query.trim(), $options: 'i' } },
          { specialization: { $regex: query.trim(), $options: 'i' } },
        ],
      };
    }

    const doctors = await Doctor.find(filter).select('-password');

    res.status(200).json({
      success: true,
      message: doctors.length > 0 ? 'Doctors found' : 'No doctors found',
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId).select('-password');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const { password, ...rest } = doctor._doc;
    // Populate patient details for doctor's appointment list
    const appointments = await Booking.find({ doctor: doctorId }).populate({
      path: 'user',
      select: 'name email photo gender',
    });

    // Auto-reconcile any pending Stripe payments
    if (process.env.STRIPE_SECRET_KEY && appointments && appointments.length > 0) {
      const unpaidWithStripe = appointments.filter(
        (b) => !b.isPaid && b.session && b.session.startsWith('cs_')
      );
      if (unpaidWithStripe.length > 0) {
        try {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
          await Promise.allSettled(
            unpaidWithStripe.map(async (b) => {
              try {
                const stripeSession = await stripe.checkout.sessions.retrieve(b.session);
                if (
                  stripeSession.payment_status === 'paid' ||
                  stripeSession.status === 'complete'
                ) {
                  b.isPaid = true;
                  b.status = 'approved';
                  await Booking.findByIdAndUpdate(b._id, {
                    isPaid: true,
                    status: 'approved',
                  });
                }
              } catch (stripeErr) {
                // Ignore individual retrieval errors
              }
            })
          );
        } catch (err) {
          // Non-blocking
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { ...rest, appointments },
    });
  } catch (error) {
    console.error('getDoctorProfile error ->', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, cannot get doctor profile',
      error: error.message,
    });
  }
};