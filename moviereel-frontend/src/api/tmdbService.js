import { api } from "./client.js";
// Service: EXTERNAL source (TMDB) — proxied through our backend's /external route.
export const tmdbService = {
  search: (q) => api.get(`/api/movies/external?q=${encodeURIComponent(q)}`),
};
