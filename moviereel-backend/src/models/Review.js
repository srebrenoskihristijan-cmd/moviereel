import mongoose from "mongoose";

// Collection 4: Reviews. DEPENDENT on both Movie and User.
const reviewSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, minlength: 3, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

// one review per user per movie
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
