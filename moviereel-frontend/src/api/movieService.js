import { api } from "./client.js";
import { Movie } from "../models/Movie.js";
// Service: movies (own REST API).
export const movieService = {
  list: async ({ q, genre } = {}) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (genre) qs.set("genre", genre);
    const suffix = qs.toString() ? `?${qs}` : "";
    const data = await api.get(`/api/movies${suffix}`);
    return data.map(Movie.fromApi);
  },
  get: async (id) => Movie.fromApi(await api.get(`/api/movies/${id}`)),
  create: (payload) => api.post("/api/movies", payload, true),
  update: (id, payload) => api.put(`/api/movies/${id}`, payload, true),
  remove: (id) => api.del(`/api/movies/${id}`, true),
};
