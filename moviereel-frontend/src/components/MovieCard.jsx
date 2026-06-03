import { useNavigate } from "react-router-dom";
import { Star, Eye } from "lucide-react";
import Poster from "./Poster.jsx";
import { formatRating } from "../utils/transforms.js";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  return (
    <div className="mr-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="mr-poster">
        <Poster movie={movie} big />
        {movie.avgRating > 0 && (
          <div className="mr-rate-badge">
            <Star size={12} fill="var(--gold)" color="var(--gold)" />{formatRating(movie.avgRating)}
          </div>
        )}
        <div className="pt">
          <div className="ptitle">{movie.title}</div>
          <div className="pmeta">{movie.year} · {movie.genreName || "—"}</div>
        </div>
        <div className="mr-overlay" style={{ background: "rgba(8,6,10,0.35)" }}>
          <span className="btn btn-gold btn-sm"><Eye size={15} /> View</span>
        </div>
      </div>
    </div>
  );
}
