import Watchlist from "../models/Watchlist.js";

export const myWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.user._id })
      .populate({ path: "movie", populate: { path: "genre", select: "name" } });
    res.json(items);
  } catch (err) { next(err); }
};

export const addToWatchlist = async (req, res, next) => {
  try {
    const item = await Watchlist.findOneAndUpdate(
      { user: req.user._id, movie: req.body.movie },
      {},
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(item);
  } catch (err) { next(err); }
};

export const removeFromWatchlist = async (req, res, next) => {
  try {
    await Watchlist.findOneAndDelete({ user: req.user._id, movie: req.params.movieId });
    res.status(204).send();
  } catch (err) { next(err); }
};
