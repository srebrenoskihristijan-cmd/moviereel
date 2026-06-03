import { useEffect, useState } from "react";
import { Shield, Plus, Trash2, Edit3, BarChart3, Search as SearchIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { movieService } from "../api/movieService.js";
import { reviewService } from "../api/reviewService.js";
import { genreService } from "../api/genreService.js";
import { tmdbService } from "../api/tmdbService.js";
import Modal from "../components/Modal.jsx";
import StarRating from "../components/StarRating.jsx";
import { truncate, formatRating } from "../utils/transforms.js";
import { validateMovie } from "../utils/validators.js";

const emptyForm = { title: "", year: "", genre: "", director: "", runtime: "", overview: "", accent: "#e0a93f", posterUrl: "", tmdbId: null };

export default function Admin() {
  const [tab, setTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [genres, setGenres] = useState([]);
  const [editing, setEditing] = useState(null); // "new" | movieId | null
  const [form, setForm] = useState(emptyForm);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const loadAll = () => {
    movieService.list().then(setMovies).catch(() => {});
    reviewService.listAll().then(setReviews).catch(() => {});
    genreService.list().then(setGenres).catch(() => {});
  };
  useEffect(loadAll, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const openNew = () => { setForm(emptyForm); setErrs({}); setEditing("new"); };
  const openEdit = (m) => {
    setForm({ title: m.title, year: String(m.year), genre: m.genreId || "", director: m.director,
      runtime: String(m.runtime || ""), overview: m.overview, accent: m.accent, posterUrl: m.posterUrl, tmdbId: m.tmdbId });
    setErrs({}); setEditing(m.id);
  };

  const save = async () => {
    const e = validateMovie(form);
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const payload = { ...form, year: Number(form.year), runtime: form.runtime ? Number(form.runtime) : undefined };
    try {
      if (editing === "new") await movieService.create(payload);
      else await movieService.update(editing, payload);
      setEditing(null); loadAll();
    } catch (err) { setErrs({ form: err.message }); }
    finally { setBusy(false); }
  };

  const removeMovie = async (id) => { await movieService.remove(id); loadAll(); };
  const removeReview = async (id) => { await reviewService.remove(id); loadAll(); };

  const movieTitle = (mid) => movies.find((m) => m.id === mid)?.title || "—";

  const genreData = genres
    .map((g) => ({ genre: g.name, count: movies.filter((m) => m.genreId === g.id).length }))
    .filter((d) => d.count > 0);

  return (
    <>
      <div className="mr-sec" style={{ marginTop: 30 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}><Shield size={22} color="var(--gold)" /> Admin dashboard</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 6 }}>
        <div className="mr-stat"><div className="n">{movies.length}</div><div className="l">Movies</div></div>
        <div className="mr-stat"><div className="n">{reviews.length}</div><div className="l">Reviews</div></div>
        <div className="mr-stat"><div className="n">{genres.length}</div><div className="l">Genres</div></div>
        <div className="mr-stat"><div className="n">{formatRating(reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1))}</div><div className="l">Avg rating</div></div>
      </div>

      <div className="mr-tabs">
        {["movies", "reviews", "stats"].map((t) => (
          <button key={t} className={"mr-tab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "movies" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 14 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setImportOpen(true)}><SearchIcon size={15} /> Import from TMDB</button>
            <button className="btn btn-gold btn-sm" onClick={openNew}><Plus size={16} /> Add movie</button>
          </div>
          <table className="mr-table">
            <thead><tr><th>Title</th><th>Year</th><th>Genre</th><th>Rating</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.title}</td>
                  <td className="mr-mono">{m.year}</td>
                  <td>{m.genreName || "—"}</td>
                  <td><StarRating value={m.avgRating} /></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}><Edit3 size={13} /></button>{" "}
                    <button className="btn btn-red btn-sm" onClick={() => removeMovie(m.id)}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "reviews" && (
        <table className="mr-table">
          <thead><tr><th>Movie</th><th>User</th><th>Rating</th><th>Comment</th><th></th></tr></thead>
          <tbody>
            {reviews.length === 0 && <tr><td colSpan={5} className="mr-empty">No reviews.</td></tr>}
            {reviews.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{movieTitle(typeof r.movie === "object" ? r.movie?._id : r.movie)}</td>
                <td>{r.username}</td>
                <td><StarRating value={r.rating} /></td>
                <td style={{ color: "var(--muted)", maxWidth: 320 }}>{truncate(r.text, 90)}</td>
                <td style={{ textAlign: "right" }}><button className="btn btn-red btn-sm" onClick={() => removeReview(r.id)}><Trash2 size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "stats" && (
        <div className="mr-stat" style={{ padding: "22px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontWeight: 700 }}>
            <BarChart3 size={18} color="var(--gold)" /> Movies per genre
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genreData} margin={{ left: -18 }}>
              <XAxis dataKey="genre" tick={{ fill: "var(--muted)", fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--ink2)", border: "1px solid var(--line2)", borderRadius: 8, color: "var(--paper)" }} cursor={{ fill: "rgba(224,169,63,0.08)" }} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>{genreData.map((_, i) => <Cell key={i} fill="var(--gold)" />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* add/edit modal */}
      {editing && (
        <Modal title={editing === "new" ? "Add movie" : "Edit movie"} sub="All fields are validated before saving." maxWidth={520} onClose={() => setEditing(null)}>
          <div className="mr-field"><label>Title</label>
            <input className="mr-input" value={form.title} onChange={set("title")} />
            {errs.title && <div className="mr-err">{errs.title}</div>}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="mr-field"><label>Year</label>
              <input className="mr-input" value={form.year} onChange={set("year")} placeholder="2024" />
              {errs.year && <div className="mr-err">{errs.year}</div>}</div>
            <div className="mr-field"><label>Runtime (min)</label>
              <input className="mr-input" value={form.runtime} onChange={set("runtime")} placeholder="120" />
              {errs.runtime && <div className="mr-err">{errs.runtime}</div>}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="mr-field"><label>Genre</label>
              <select className="mr-select" value={form.genre} onChange={set("genre")}>
                <option value="">Select…</option>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              {errs.genre && <div className="mr-err">{errs.genre}</div>}</div>
            <div className="mr-field"><label>Accent colour</label>
              <input type="color" className="mr-input" style={{ height: 44, padding: 4 }} value={form.accent} onChange={set("accent")} /></div>
          </div>
          <div className="mr-field"><label>Director</label>
            <input className="mr-input" value={form.director} onChange={set("director")} />
            {errs.director && <div className="mr-err">{errs.director}</div>}</div>
          <div className="mr-field"><label>Overview</label>
            <textarea className="mr-area" value={form.overview} onChange={set("overview")} />
            {errs.overview && <div className="mr-err">{errs.overview}</div>}</div>
          {errs.form && <div className="mr-err">{errs.form}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-gold" onClick={save} disabled={busy}>{editing === "new" ? "Create" : "Save changes"}</button>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* TMDB import modal (external source) */}
      {importOpen && <TmdbImport genres={genres} onClose={() => setImportOpen(false)} onPick={(prefill) => { setImportOpen(false); setForm({ ...emptyForm, ...prefill }); setErrs({}); setEditing("new"); }} />}
    </>
  );
}

function TmdbImport({ onClose, onPick }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!q.trim()) return;
    setLoading(true); setMsg("");
    try { setResults(await tmdbService.search(q.trim())); }
    catch (e) { setMsg(e.message); setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="Import from TMDB" sub="Search the external source, then pick a film to prefill the form." maxWidth={520} onClose={onClose}>
      <div className="mr-search-mini" style={{ marginBottom: 14 }}>
        <SearchIcon size={16} />
        <input autoFocus placeholder="e.g. Blade Runner" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
      </div>
      <button className="btn btn-gold btn-sm" style={{ marginBottom: 14 }} onClick={search} disabled={loading}>{loading ? "Searching…" : "Search TMDB"}</button>
      {msg && <div className="mr-err" style={{ marginBottom: 10 }}>{msg}</div>}
      {results.map((r) => (
        <div key={r.tmdbId} className="mr-tmdb-item"
          onClick={() => onPick({ title: r.title, year: r.year ? String(r.year) : "", overview: r.overview || "", posterUrl: r.posterUrl || "", tmdbId: r.tmdbId })}>
          {r.posterUrl ? <img src={r.posterUrl} alt="" /> : <div style={{ width: 46, height: 69, borderRadius: 6, background: "var(--card2)" }} />}
          <div>
            <div style={{ fontWeight: 600 }}>{r.title} {r.year ? `(${r.year})` : ""}</div>
            <div className="mr-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{truncate(r.overview, 90)}</div>
          </div>
        </div>
      ))}
    </Modal>
  );
}
