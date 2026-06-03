import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import Watchlist from "../models/Watchlist.js";
import { searchTmdb } from "../services/tmdb.js";

export const listMovies = async (req, res, next) => {
  try {
    const { q, genre } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (q) filter.$or = [{ title: new RegExp(q, "i") }, { director: new RegExp(q, "i") }];
    const movies = await Movie.find(filter).populate("genre", "name").sort("-createdAt");
    res.json(movies);
  } catch (err) { next(err); }
};

export const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("genre", "name");
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json(movie);
  } catch (err) { next(err); }
};

export const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) { next(err); }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json(movie);
  } catch (err) { next(err); }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    // keep data consistent: remove dependent reviews + watchlist entries
    await Promise.all([
      Review.deleteMany({ movie: movie._id }),
      Watchlist.deleteMany({ movie: movie._id }),
    ]);
    res.status(204).send();
  } catch (err) { next(err); }
};

// External source (TMDB) search.
export const searchExternal = async (req, res, next) => {
  try {
    const results = await searchTmdb(req.query.q || "");
    res.json(results);
  } catch (err) { next(err); }
};
