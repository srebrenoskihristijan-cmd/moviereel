import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

const recalcRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId });
  const avg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;
  await Movie.findByIdAndUpdate(movieId, { avgRating: Math.round(avg * 10) / 10 });
};

export const listReviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.movie) filter.movie = req.query.movie;
    const reviews = await Review.find(filter).populate("user", "username").sort("-createdAt");
    res.json(reviews);
  } catch (err) { next(err); }
};

// Create or update the current user's review for a movie (one per user/movie).
export const createReview = async (req, res, next) => {
  try {
    const { movie, rating, text } = req.body;
    const review = await Review.findOneAndUpdate(
      { movie, user: req.user._id },
      { rating, text },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await recalcRating(movie);
    res.status(201).json(review);
  } catch (err) { next(err); }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });
    // owner or admin only
    if (req.user.role !== "admin" && String(review.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own review." });
    }
    await review.deleteOne();
    await recalcRating(review.movie);
    res.status(204).send();
  } catch (err) { next(err); }
};
