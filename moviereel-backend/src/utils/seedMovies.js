import axios from 'axios';
import Movie from '../models/Movie.js';
import Genre from '../models/Genre.js';

const TMDB_KEY = process.env.TMDB_API_KEY;

const TMDB_GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

async function getOrCreateGenre(tmdbGenreId) {
  const name = TMDB_GENRE_MAP[tmdbGenreId] || 'Other';
  let genre = await Genre.findOne({ name });
  if (!genre) genre = await Genre.create({ name });
  return genre._id;
}

async function getDirector(tmdbId) {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
      { params: { api_key: TMDB_KEY } }
    );
    const director = data.crew?.find(c => c.job === 'Director');
    return director ? director.name : 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function seedPopularMovies(count = 1000) {
  if (!TMDB_KEY) {
    console.log("⚠️ TMDB_API_KEY not found. Skipping seeding.");
    return { newMovies: 0 };
  }

  console.log(`🎬 Seeding up to ${count} movies from TMDB (with real directors)...`);

  let newMovies = 0;
  let page = 1;

  while (newMovies < count) {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      { params: { api_key: TMDB_KEY, page, language: 'en-US' } }
    );

    for (const m of data.results) {
      if (newMovies >= count) break;

      const exists = await Movie.findOne({ tmdbId: m.id });
      if (exists) continue;

      const genreId = await getOrCreateGenre(m.genre_ids?.[0]);
      const director = await getDirector(m.id);
      const year = m.release_date ? parseInt(m.release_date.split('-')[0]) : 2000;

      await Movie.create({
        title: m.title,
        year,
        genre: genreId,
        director,
        runtime: m.runtime || 120,
        overview: m.overview || '',
        posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
        tmdbId: m.id,
        avgRating: m.vote_average ? +(m.vote_average / 2).toFixed(1) : 0,
      });

      newMovies++;
      console.log(`✅ [${newMovies}/${count}] ${m.title} — ${director}`);
    }

    page++;
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`🎉 Done! Added ${newMovies} movies with real directors.`);
  return { newMovies };
}