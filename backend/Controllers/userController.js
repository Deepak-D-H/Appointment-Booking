import User from '../models/UserSchema.js';
import Booking from '../models/BookingSchema.js';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';

export const updateUser = async (req, res) => {
  const id = req.params.id;

  // Authorization check: user can only update their own profile unless admin
  if (req.userId !== id && req.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to update this profile' });
  }

  try {
    const updateData = { ...req.body };

    // Prevent privilege escalation: only admin can alter role
    if (req.role !== 'admin') {
      delete updateData.role;
    }

    // Handle password update if supplied
    if (updateData.password && updateData.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  // Authorization check: user can only delete their own profile unless admin
  if (req.userId !== id && req.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to delete this profile' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User found', data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: 'No user found' });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, message: 'Users found', data: users });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...rest } = user._doc;
    res.status(200).json({ success: true, message: 'Profile retrieved successfully', data: { ...rest } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong, cannot get profile' });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    // Find bookings for the user and populate the doctor field
    const bookings = await Booking.find({ user: req.userId }).populate({
      path: 'doctor',
      select: '-password',
    });

    // Auto-reconcile any pending Stripe payments
    if (process.env.STRIPE_SECRET_KEY && bookings && bookings.length > 0) {
      const unpaidWithStripe = bookings.filter(
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

    const doctors = bookings.map((b) => b.doctor).filter(Boolean);

    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error('getMyAppointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
    });
  }
};
