// External-source integration via OMDB (https://www.omdbapi.com/).

// Reads OMDB_API_KEY, and falls back to TMDB_API_KEY so an existing .env still

// works. Function names are kept (searchTmdb / tmdbEnabled) so nothing else in

// the project needs to change.

const OMDB_BASE = "https://www.omdbapi.com/";



const apiKey = () => process.env.OMDB_API_KEY || process.env.TMDB_API_KEY;



export const tmdbEnabled = () => Boolean(apiKey());



export const searchTmdb = async (query) => {

  if (!tmdbEnabled()) {

    throw Object.assign(new Error("OMDB API key is not configured."), { status: 503 });

  }

  if (!query || !query.trim()) return [];



  const url = `${OMDB_BASE}?apikey=${apiKey()}&type=movie&s=${encodeURIComponent(query)}`;

  const res = await fetch(url); // global fetch (Node 18+)

  if (!res.ok) throw Object.assign(new Error("OMDB request failed."), { status: 502 });



  const data = await res.json();

  if (data.Response === "False") {

    // OMDB returns 200 with an Error field (e.g. "Invalid API key!",

    // "Movie not found!", "Request limit reached!").

    if (/not found/i.test(data.Error || "")) return [];

    throw Object.assign(new Error(`OMDB: ${data.Error}`), { status: 502 });

  }



  const list = (data.Search || []).slice(0, 8);



  // Enrich each hit with its plot via a detail lookup (best-effort).

  return Promise.all(

    list.map(async (m) => {

      let overview = "";

      try {

        const d = await (await fetch(`${OMDB_BASE}?apikey=${apiKey()}&i=${m.imdbID}&plot=short`)).json();

        if (d.Response !== "False" && d.Plot && d.Plot !== "N/A") overview = d.Plot;

      } catch { /* ignore detail errors */ }

      return {

        tmdbId: null, // OMDB ids are strings (e.g. "tt0083658"); our Movie.tmdbId is numeric

        title: m.Title,

        year: m.Year ? Number(String(m.Year).slice(0, 4)) : null,

        overview,

        posterUrl: m.Poster && m.Poster !== "N/A" ? m.Poster : "",

        tmdbRating: null,

      };

    })

  );

};