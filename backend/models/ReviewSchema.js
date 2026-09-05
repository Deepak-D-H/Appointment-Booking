import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name photo",
  });
});

reviewSchema.statics.calculateAverageRatings = async function (doctorId) {
  try {
    const docObjectId = mongoose.Types.ObjectId.isValid(doctorId)
      ? new mongoose.Types.ObjectId(doctorId)
      : doctorId;

    const stats = await this.aggregate([
      {
        $match: { doctor: docObjectId },
      },
      {
        $group: {
          _id: "$doctor",
          numOfRating: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      await Doctor.findByIdAndUpdate(doctorId, {
        totalRating: stats[0].numOfRating,
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
      });
    } else {
      await Doctor.findByIdAndUpdate(doctorId, {
        totalRating: 0,
        averageRating: 0,
      });
    }
  } catch (err) {
    console.error("calculateAverageRatings error:", err.message || err);
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRatings(this.doctor);
});

export default mongoose.model("Review", reviewSchema);