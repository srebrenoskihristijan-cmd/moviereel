// External source integration via TMDB[](https://www.themoviedb.org/)

const TMDB_BASE = "https://api.themoviedb.org/3";

const getApiKey = () => process.env.TMDB_API_KEY;

export const tmdbEnabled = () => Boolean(getApiKey());

export const searchTmdb = async (query) => {
  if (!tmdbEnabled()) {
    throw Object.assign(new Error("TMDB API key is not configured."), { status: 503 });
  }

  if (!query || !query.trim()) return [];

  const url = `${TMDB_BASE}/search/movie?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

  const res = await fetch(url);
  if (!res.ok) {
    throw Object.assign(new Error("TMDB request failed."), { status: 502 });
  }

  const data = await res.json();

  if (!data.results || data.results.length === 0) return [];

  const results = data.results.slice(0, 8);

  return Promise.all(
    results.map(async (movie) => {
      let overview = movie.overview || "";
      let posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : "";

      try {
        const detailRes = await fetch(
          `${TMDB_BASE}/movie/${movie.id}?api_key=${getApiKey()}&language=en-US`
        );
        if (detailRes.ok) {
          const detail = await detailRes.json();
          if (detail.overview) overview = detail.overview;
          if (detail.poster_path) {
            posterUrl = `https://image.tmdb.org/t/p/w500${detail.poster_path}`;
          }
        }
      } catch (_) {
        // ignore enrichment errors
      }

      return {
        tmdbId: movie.id,
        title: movie.title,
        year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
        overview: overview,
        posterUrl: posterUrl,
        tmdbRating: movie.vote_average || null,
      };
    })
  );
};