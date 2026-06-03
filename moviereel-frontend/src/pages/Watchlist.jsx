import { useEffect, useState } from "react";
import { watchlistService } from "../api/watchlistService.js";
import MovieCard from "../components/MovieCard.jsx";
import { Bookmark } from "lucide-react";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const data = await watchlistService.mine();
      // Извлекуваме само филмовите од watchlist записите
      const movieList = data.map(item => item.movie).filter(Boolean);
      setMovies(movieList);
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await watchlistService.remove(movieId);
      // Освежи ја листата
      loadWatchlist();
    } catch (err) {
      alert("Failed to remove from watchlist");
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  return (
    <>
      <div className="mr-sec" style={{ marginTop: 30 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bookmark size={28} /> My Watchlist
        </h2>
      </div>

      {loading ? (
        <div className="mr-empty">Loading your watchlist...</div>
      ) : movies.length > 0 ? (
        <div className="mr-grid">
          {movies.map((movie) => (
            <div key={movie.id} style={{ position: "relative" }}>
              <MovieCard movie={movie} />
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="btn btn-red btn-sm"
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 10,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mr-empty">
          Your watchlist is empty.<br />
          Add movies from the movie detail page.
        </div>
      )}
    </>
  );
}