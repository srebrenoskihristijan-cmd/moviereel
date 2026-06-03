import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { movieService } from "../api/movieService.js";
import { genreService } from "../api/genreService.js";
import MovieCard from "../components/MovieCard.jsx";
import { pluralize } from "../utils/transforms.js";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { genreService.list().then(setGenres).catch(() => {}); }, []);

  // debounce queries to the API
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      movieService.list({ q: q.trim() || undefined, genre: genreId || undefined })
        .then(setMovies).catch(() => setMovies([])).finally(() => setLoading(false));
    }, 250);
    setParams(q.trim() ? { q: q.trim() } : {}, { replace: true });
    return () => clearTimeout(t);
  }, [q, genreId]);

  return (
    <>
      <div className="mr-sec" style={{ marginTop: 30 }}><h2>Search the catalogue</h2></div>
      <div className="mr-search-mini" style={{ display: "flex", minWidth: 0, marginBottom: 16, padding: "12px 14px" }}>
        <SearchIcon size={18} />
        <input autoFocus placeholder="Search by title or director…" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <X size={16} style={{ cursor: "pointer" }} onClick={() => setQ("")} />}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        <button className="btn btn-sm" onClick={() => setGenreId("")}
          style={{ background: !genreId ? "var(--gold)" : "transparent", color: !genreId ? "#1a1206" : "var(--muted)", border: `1px solid ${!genreId ? "var(--gold)" : "var(--line2)"}` }}>All</button>
        {genres.map((g) => (
          <button key={g.id} className="btn btn-sm" onClick={() => setGenreId(g.id)}
            style={{ background: genreId === g.id ? "var(--gold)" : "transparent", color: genreId === g.id ? "#1a1206" : "var(--muted)", border: `1px solid ${genreId === g.id ? "var(--gold)" : "var(--line2)"}` }}>{g.name}</button>
        ))}
      </div>
      <div className="mr-sec" style={{ margin: "0 0 16px" }}>
        <span className="hint mr-mono">{loading ? "Searching…" : pluralize(movies.length, "result")}</span>
      </div>
      {movies.length ? (
        <div className="mr-grid">{movies.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
      ) : (!loading && <div className="mr-empty">No films match your search.</div>)}
    </>
  );
}
