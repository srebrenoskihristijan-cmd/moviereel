import User from "../models/User.js";
import Genre from "../models/Genre.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import Watchlist from "../models/Watchlist.js";
import { seedPopularMovies } from "./seedMovies.js";

const GENRES = [
  "Drama", "Sci-Fi", "Crime", "Thriller", "Comedy",
  "Animation", "Horror", "Romance", "Action", "Documentary",
];

export const wipeDatabase = async () => {
  await Promise.all([
    User.deleteMany({}),
    Genre.deleteMany({}),
    Movie.deleteMany({}),
    Review.deleteMany({}),
    Watchlist.deleteMany({}),
  ]);
};

export const seedDatabase = async ({ force = false } = {}) => {
  const existing = await Movie.estimatedDocumentCount();

  // === SEED_ON_START mode: 1000 TMDB movies + demo users ===
  if (process.env.SEED_ON_START === "true" && existing === 0) {
    console.log("🌱 SEED_ON_START enabled → Seeding 1000 TMDB movies + demo users");
    await wipeDatabase();

    // Create demo users
    await User.create({
      username: "admin",
      email: "admin@moviereel.app",
      password: "admin123",
      role: "admin",
    });

    await User.create({
      username: "cinephile",
      email: "cine@moviereel.app",
      password: "demo123",
      role: "user",
    });

    // Seed 1000 real movies from TMDB
    const result = await seedPopularMovies(1000);

    return { users: 2, movies: result.newMovies, source: "TMDB + demo users" };
  }

  // === Normal / Manual seeding (for /db page) ===
  if (existing > 0 && !force) return { skipped: true };

  await wipeDatabase();

  const genres = await Genre.insertMany(GENRES.map((name) => ({ name })));
  const gid = (name) => genres.find((g) => g.name === name)._id;

  const admin = await User.create({
    username: "admin", email: "admin@moviereel.app", password: "admin123", role: "admin",
  });
  const cinephile = await User.create({
    username: "cinephile", email: "cine@moviereel.app", password: "demo123", role: "user",
  });

  const movies = await Movie.insertMany([
    { title: "Echoes of Tomorrow", year: 2021, genre: gid("Sci-Fi"), director: "Lena Markovic", runtime: 142, accent: "#5b8def", overview: "A signals engineer discovers her own voice buried in a deep-space transmission." },
    { title: "The Quiet Ledger", year: 2019, genre: gid("Crime"), director: "Idris Vale", runtime: 118, accent: "#c8503f", overview: "A meek accountant turns a laundering ring's books into the instrument of its undoing." },
    { title: "Paper Lanterns", year: 2022, genre: gid("Drama"), director: "Mei Tanaka", runtime: 109, accent: "#e0a93f", overview: "Three generations reunite in a fading seaside town as old letters resurface." },
    { title: "The Long Orbit", year: 2024, genre: gid("Sci-Fi"), director: "Nia Powell", runtime: 155, accent: "#3aa6a6", overview: "Stranded on a generation ship, a botanist must decide what of humanity to keep alive." },
    { title: "Concrete Lions", year: 2022, genre: gid("Action"), director: "Marcus Dube", runtime: 124, accent: "#e07b39", overview: "A retired stunt performer protects the only witness to a deadly studio cover-up." },
  ]);

  await Review.insertMany([
    { movie: movies[0]._id, user: cinephile._id, rating: 5, text: "Quietly devastating. The sound design alone is worth it." },
    { movie: movies[0]._id, user: admin._id, rating: 4, text: "Slow first act but the payoff lands." },
    { movie: movies[1]._id, user: cinephile._id, rating: 5, text: "A perfect little thriller, no wasted scenes." },
  ]);

  for (const m of movies) {
    const rs = await Review.find({ movie: m._id });
    if (rs.length) {
      const avg = rs.reduce((a, r) => a + r.rating, 0) / rs.length;
      await Movie.findByIdAndUpdate(m._id, { avgRating: Math.round(avg * 10) / 10 });
    }
  }

  await Watchlist.create({ user: cinephile._id, movie: movies[3]._id });

  return { genres: genres.length, users: 2, movies: movies.length, reviews: 3, watchlist: 1, source: "demo" };
};