import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Film } from "lucide-react";
import { movieService } from "../api/movieService.js";
import MovieCard from "../components/MovieCard.jsx";
import Poster from "../components/Poster.jsx";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [state, setState] = useState("loading"); // loading | ok | error
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    movieService.list()
      .then((m) => { setMovies(m); setState("ok"); })
      .catch((e) => { setError(e.message); setState("error"); });
  }, []);

  if (state === "loading")
    return <div className="mr-empty" style={{ paddingTop: 90 }}><Film size={30} color="var(--gold)" /><div style={{ marginTop: 10 }}>Loading the reel…</div></div>;
  if (state === "error")
    return <div className="mr-empty" style={{ paddingTop: 90 }}>Couldn't reach the API: {error}<br /><span className="mr-mono" style={{ fontSize: 12 }}>Is the backend running on the VITE_API_URL?</span></div>;
  if (!movies.length) return <div className="mr-empty" style={{ paddingTop: 90 }}>No movies yet. Seed the database at <code>/db</code>.</div>;

  const byRating = [...movies].sort((a, b) => b.avgRating - a.avgRating);
  const featured = byRating[0];
  const topRated = byRating.slice(0, 6);
  const newest = [...movies].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 6);

  return (
    <>
      <div className="mr-hero">
        <div className="mr-hero-bg"><Poster movie={featured} /></div>
        <div className="mr-hero-bg" style={{ background: "linear-gradient(90deg, rgba(10,8,12,0.92) 0%, rgba(10,8,12,0.55) 55%, transparent)" }} />
        <div className="mr-hero-in">
          <div className="mr-kicker">★ Featured tonight</div>
          <h1>{featured.title}</h1>
          <p>{featured.overview}</p>
          <button className="btn btn-gold" onClick={() => navigate(`/movie/${featured.id}`)}><Eye size={17} /> View details</button>
        </div>
      </div>

      <div className="mr-sec"><h2>Top rated</h2><span className="hint">by viewer reviews</span></div>
      <div className="mr-grid">{topRated.map((m) => <MovieCard key={m.id} movie={m} />)}</div>

      <div className="mr-sec"><h2>Recently added</h2></div>
      <div className="mr-grid">{newest.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
    </>
  );
}
