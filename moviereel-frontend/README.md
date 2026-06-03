# MovieReel — Frontend (Web Programming 2026
)

A React SPA that consumes the MovieReel REST API. Routing, views and controls
run entirely client-side; data comes from the backend over REST, with JWT auth.

## Run it

The backend must be running first (see the `moviereel-backend` project — e.g.
`docker-compose up`). Then:

```bash
cp .env.example .env        # set VITE_API_URL if the API isn't on :5000
npm install
npm run dev                 # http://localhost:5173
```

`VITE_API_URL` defaults to `http://localhost:5000`.

Demo logins (after the backend seeds): **admin / admin123**, **cinephile / demo123**.

## How it maps:

- **Routing module** — `react-router-dom`; routes in `App.jsx`, browser
  back/forward works. `ProtectedRoute` guards the admin route by role.
- **5 transformation pipes** — `utils/transforms.js`: `formatRuntime`,
  `formatRating`, `truncate`, `formatDate`, `pluralize`, `genreName` (used in
  cards, detail, search, admin).
- **5 model classes mirroring the DB** — `models/`: `User`, `Genre`, `Movie`,
  `Review`, `Watchlist` (each with a `fromApi` mapper).
- **Services** — `api/`: own REST API (`movieService`, `reviewService`,
  `authService`, `genreService`, `watchlistService`) **and** the external source
  (`tmdbService`, via the backend's `/api/movies/external`).
- **A component per screen** — `pages/`: Home, Search, MovieDetail, Login,
  Register, Admin.
- **Reusable components** — `components/`: Navbar, Footer, Modal, MovieCard,
  Poster, StarRating, StarInput, ProtectedRoute. Components adapt to their data
  (e.g. Poster shows a TMDB image or a generated gradient).
- **Popup modal** — every popup uses `components/Modal.jsx` (add/edit movie,
  TMDB import).
- **Chart** — `recharts` bar chart (movies per genre) in the admin dashboard.
- **Client-side validation with regex** — `utils/validators.js` (username,
  email, password, year, runtime, hex colour, rating, review length).
- **JWT auth + 3 roles** — `context/AuthContext.jsx` stores the token and user;
  guest / user / admin see different controls.

## Allowed inputs (validation reference)
- **username** — 3–20 chars, `^[a-zA-Z0-9_]+$`
- **email** — standard email pattern
- **password** — min 6 chars
- **year** — 1888–2100 · **runtime** — 1–600 · **accent** — `^#[0-9a-fA-F]{6}$`
- **review rating** — 1–5 · **review text** — 3–1000 chars

## Roles
| Role | Can |
|------|-----|
| Guest | browse, search, view movies & reviews |
| User  | + write/edit/delete own review, add to watchlist |
| Admin | + add/edit/delete movies (incl. TMDB import), delete any review, see stats |
