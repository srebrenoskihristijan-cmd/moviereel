import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, User as UserIcon, Trash2, Bookmark } from "lucide-react";
import { movieService } from "../api/movieService.js";
import { reviewService } from "../api/reviewService.js";
import { watchlistService } from "../api/watchlistService.js";
import { useAuth } from "../context/AuthContext.jsx";
import Poster from "../components/Poster.jsx";
import StarRating from "../components/StarRating.jsx";
import StarInput from "../components/StarInput.jsx";
import { formatRuntime, formatDate, formatRating, pluralize } from "../utils/transforms.js";
import { validateReview } from "../utils/validators.js";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [watchMsg, setWatchMsg] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([movieService.get(id), reviewService.listByMovie(id)])
      .then(([m, r]) => {
        setMovie(m); setReviews(r);
        const mine = r.find((x) => x.username === user?.username);
        if (mine) { setRating(mine.rating); setText(mine.text); }
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id, user?.username]);

  const submit = async () => {
    const e = validateReview({ rating, text });
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await reviewService.save({ movie: id, rating, text: text.trim() });
      setSaved(true); setTimeout(() => setSaved(false), 1500);
      load();
    } catch (err) { setErrs({ text: err.message }); }
    finally { setBusy(false); }
  };

  const removeReview = async (rid) => { await reviewService.remove(rid); load(); };
  const addWatch = async () => {
    try { await watchlistService.add(id); setWatchMsg("Added to your watchlist."); }
    catch (e) { setWatchMsg(e.message); }
    setTimeout(() => setWatchMsg(""), 2000);
  };

  if (loading) return <div className="mr-empty" style={{ paddingTop: 80 }}>Loading…</div>;
  if (!movie) return <div className="mr-empty" style={{ paddingTop: 80 }}>Movie not found.</div>;

  const myReview = reviews.find((r) => r.username === user?.username);

  return (
    <>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={() => navigate(-1)}><ChevronLeft size={16} /> Back</button>
      <div className="mr-detail-top">
        <div className="mr-detail-poster"><Poster movie={movie} big /></div>
        <div className="mr-detail">
          <span className="mr-tag">{movie.genreName || "—"}</span>
          <h1>{movie.title}</h1>
          <div className="mr-meta-row">
            <span><Calendar size={15} /> {movie.year}</span>
            <span><Clock size={15} /> {formatRuntime(movie.runtime)}</span>
            <span><UserIcon size={15} /> {movie.director}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <StarRating value={movie.avgRating} size={18} />
            <span className="mr-mono" style={{ color: "var(--muted)", fontSize: 14 }}>
              {formatRating(movie.avgRating)} · {pluralize(reviews.length, "review")}
            </span>
          </div>
          <p style={{ lineHeight: 1.65, color: "rgba(244,236,224,0.9)", maxWidth: 620 }}>{movie.overview}</p>
          {user && (
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-ghost btn-sm" onClick={addWatch}><Bookmark size={15} /> Add to watchlist</button>
              {watchMsg && <span className="mr-mono" style={{ marginLeft: 10, fontSize: 12, color: "var(--gold)" }}>{watchMsg}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="mr-sec"><h2>Reviews</h2></div>

      {user ? (
        <div className="mr-review" style={{ background: "var(--ink2)" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{myReview ? "Edit your review" : "Leave a review"}</div>
          <div style={{ marginBottom: 12 }}><StarInput value={rating} onChange={setRating} /></div>
          {errs.rating && <div className="mr-err" style={{ marginTop: -6, marginBottom: 8 }}>{errs.rating}</div>}
          <textarea className="mr-area" placeholder="What did you think?" value={text} onChange={(e) => setText(e.target.value)} />
          {errs.text && <div className="mr-err">{errs.text}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
            <button className="btn btn-gold btn-sm" onClick={submit} disabled={busy}>{myReview ? "Update review" : "Post review"}</button>
            {myReview && <button className="btn btn-red btn-sm" onClick={() => removeReview(myReview.id)}><Trash2 size={14} /> Delete mine</button>}
            {saved && <span className="mr-mono" style={{ fontSize: 12, color: "var(--gold)" }}>Saved ✓</span>}
          </div>
        </div>
      ) : (
        <div className="mr-hintbox" style={{ marginBottom: 18 }}>
          <Link to="/login" style={{ color: "var(--gold)", fontWeight: 700 }}>Log in</Link> to leave a review.
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="mr-empty">No reviews yet — be the first.</div>
      ) : (
        reviews.map((r) => (
          <div className="mr-review" key={r.id}>
            <div className="mr-review-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="mr-avatar">{r.username[0]?.toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.username}</div>
                  <div className="mr-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{formatDate(r.createdAt)}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StarRating value={r.rating} />
                {(user?.isAdmin || user?.username === r.username) && (
                  <Trash2 size={15} style={{ cursor: "pointer", color: "var(--red)" }} onClick={() => removeReview(r.id)} />
                )}
              </div>
            </div>
            <div style={{ lineHeight: 1.55 }}>{r.text}</div>
          </div>
        ))
      )}
    </>
  );
}
