import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketPrice: { type: Number, required: true },
    appointmentDate: {
      type: Date,
      default: Date.now,
    },
    session: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function () {
  this.populate('user').populate({
    path: 'doctor',
    select: 'name photo specialization averageRating totalRating experiences ticketPrice',
  });
});

export default mongoose.model('Booking', bookingSchema);