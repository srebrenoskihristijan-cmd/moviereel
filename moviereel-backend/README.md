# MovieReel — REST API (Web Programming 2026, Parts 2 & 3)

Server-side business logic for the MovieReel platform: an Express + MongoDB
REST API with JWT authentication, role-based authorization, Swagger
documentation, and an external-source (TMDB) integration. The React SPA
(Part 4) consumes this API.

## Live deployment
> _Add your deployed URL here (e.g. Heroku) + MongoDB Atlas notes._
> Production link: `https://<your-app>.herokuapp.com`

---

## Architecture (MVC)

```
src/
├── server.js            # entry point: connect DB, (optional) seed, start server
├── app.js               # Express app, middleware, route mounting, Swagger
├── config/
│   ├── db.js            # Mongo connection (local vs. production/Atlas)
│   └── swagger.js       # swagger-jsdoc -> OpenAPI spec
├── models/              # MODEL  — Mongoose schemas (5 collections)
├── controllers/         # CONTROLLER — business logic
├── routes/              # routes + @openapi JSDoc annotations
├── middleware/          # auth (JWT/roles), validation, error handler
├── services/            # tmdb.js (external source), mailer.js (nodemailer)
├── utils/               # seed.js + seedRunner.js
└── public/              # static files (index.html, db.html; React build later)
```

## Run locally with Docker (recommended)

Requires Docker + Docker Compose. One command brings up MongoDB **and** the API,
seeds initial data, and exposes everything:

```bash
# optional: export your TMDB key so the external-source route works
export TMDB_API_KEY=your_tmdb_v3_key

docker-compose up --build
```

Then open:
- App / homepage:        http://localhost:5000/
- Swagger UI:            http://localhost:5000/api/docs
- OpenAPI spec:          http://localhost:5000/api/swagger.json
- DB reset/seed page:    http://localhost:5000/db

MongoDB data is persisted in the `mongo_data` Docker volume.

## Run locally without Docker

```bash
cp .env.example .env        # then edit values
npm install
npm run seed                # optional: load initial data
npm run dev                 # nodemon, or: npm start
```
Requires a local MongoDB on `mongodb://127.0.0.1:27017` (or set `MONGODB_URI`).

## Local vs. production database
`config/db.js` reads `MONGODB_URI`. Locally / in Docker it points at the local
Mongo. In the cloud, set `NODE_ENV=production` and `MONGODB_URI` to your
**MongoDB Atlas** connection string — the app then uses the production database
automatically.

## npm packages used (beyond express & mongoose)
- **bcryptjs** — securely hash passwords before storing them (authentication).
- **nodemailer** — send a welcome email on registration (optional, off if no SMTP).
- **jsonwebtoken** — issue/verify JWTs for auth & authorization.
- **express-validator** — application-level input validation.
- **swagger-jsdoc** + **swagger-ui-express** — generate & serve API docs.

## Data model (5 collections, ≥2 dependent)
| Collection | Depends on | Notes |
|-----------|------------|-------|
| User      | —          | username, email, hashed password, role |
| Genre     | —          | name, description |
| **Movie** | Genre      | references a Genre |
| **Review**| Movie, User| one per user/movie (unique index) |
| **Watchlist** | Movie, User | one per user/movie (unique index) |

Adding and deleting documents is supported; deleting a movie cascades to its
reviews and watchlist entries to preserve integrity.

## Validation & integrity (three levels)
1. **Schema** — Mongoose types, `required`, `min/max`, `match` regex, unique indexes.
2. **Application** — express-validator chains on routes, before controllers.
3. **Client** — the React app validates inputs too (Part 4).

Errors are funneled through a central handler returning proper status codes
(`400`, `401`, `403`, `404`, `409`, `500`).

## Roles & access
| Role | Access |
|------|--------|
| Guest (no token) | read: list/search movies, view details & reviews, search TMDB |
| User  | + create/update/delete **own** review, manage own watchlist |
| Admin | + create/update/delete movies & genres, delete **any** review |

Seeded accounts: **admin / admin123** (admin), **cinephile / demo123** (user).

## External source
`services/tmdb.js` calls the TMDB API (`GET /api/movies/external?q=...`) to enrich
the app with data the project DB does not primarily store (posters, external
ratings). Get a free v3 API key at themoviedb.org and set `TMDB_API_KEY`.
To use OMDB instead, swap the URL + result mapping in that one file.

## Key endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me            (auth)
GET    /api/movies            ?q=&genre=
GET    /api/movies/external   ?q=          (TMDB)
GET    /api/movies/:id
POST   /api/movies            (admin)
PUT    /api/movies/:id        (admin)
DELETE /api/movies/:id        (admin)
GET    /api/reviews          ?movie=
POST   /api/reviews           (auth)
DELETE /api/reviews/:id       (auth: owner/admin)
GET    /api/genres
POST   /api/genres            (admin)
GET    /api/watchlist         (auth)
POST   /api/watchlist         (auth)
DELETE /api/watchlist/:movieId(auth)
POST   /api/db/seed
POST   /api/db/reset
```

## Allowed field inputs (validation reference)
- **username** — 3–20 chars, `^[a-zA-Z0-9_]+$`
- **email** — valid email format
- **password** — min 6 chars (stored hashed)
- **movie.year** — integer 1888–2100
- **movie.runtime** — integer 1–600
- **movie.accent** — hex colour `^#[0-9a-fA-F]{6}$`
- **review.rating** — integer 1–5
- **review.text** — 3–1000 chars
