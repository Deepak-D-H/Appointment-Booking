

import Review from '../models/ReviewSchema.js';
import Doctor from '../models/DoctorSchema.js';


// getting all the reviews
// export const getAllReviews = async(req,res)=>{
//   try{
//     const reviews = await Review.find({})

//     res.status(200).json({success:true,message:"reviews found,data:reviews"})

//   }catch(error){
//     res.status(404).json({success:false,message:"reviews not found"})

//   }
// }
// GET ALL REVIEWS OF A DOCTOR
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctor: req.params.doctorId });

        res.status(200).json({
            success: true,
            message: reviews.length > 0 ? "Reviews found" : "No reviews yet",
            data: reviews,
        });

    }
    catch (err) {
    console.log("ACTUAL ERROR:", err); // Add this
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
}
    //  catch (error) {
    //     console.log("Error fetching reviews:", error);
    //     res.status(500).json({
    //         success: false,
    //         message: "Failed to fetch reviews",
    //     });
    // }
};
// export const getAllReviews = async (req, res) => {
//   try {
//     // ✔ FIX: fetch reviews for the specific doctor
//     // const reviews = await Review.find({ doctor:req.params.doctorId });
//     const reviews = await Review.find({ doctor:new mongoose.Types.ObjectId(req.params.doctorId)});
//     // const reviews = await Review.find({ req.params.doctorId });---> it wont work

//     res.status(200).json({
//       success: true,
//       message: "Reviews found",
//       data: reviews,
//     });

//   } catch (error) {
//     res.status(404).json({
//       success: false,
//       message: "Reviews not found",
//     });
//   }
// };


//creating a new reeview

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    // ✔ FIX: attach doctor + user automatically
    req.body.doctor = req.params.doctorId;
    req.body.user = req.userId;

    const newReview = new Review(req.body);
    const savedReview = await newReview.save();

    // ✔ FIX: store review inside doctor document
    await Doctor.findByIdAndUpdate(req.params.doctorId, {
      $push: { reviews: savedReview._id }
    });

    res.status(201).json({
      success: true,
      message: "Review created",
      data: savedReview,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const createReview = async(req,res)=>{
//   if(!req.body.doctor) req.body.doctor = req.params.doctorId
//   if(!req.body.user) req.body.user = req.userId


//   const newReview = new Review(req.body)
//   try{
//     const savedReview = await newReview.save()

//     await Doctor.findByIdAndUpdate(req.params.doctorId,{$push:{reviews:savedReview._id}},{new:true})
    
//     res.status(201).json({success:true,message:"Review created",data:savedReview})

//   }catch(error){
//       res.status(500).json({success:false,message:error.message})

//   }

// }