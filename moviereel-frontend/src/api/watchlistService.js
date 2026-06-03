import { api } from "./client.js";
import { Watchlist } from "../models/Watchlist.js";
// Service: per-user watchlist (own REST API).
export const watchlistService = {
  mine: async () => (await api.get("/api/watchlist", true)).map(Watchlist.fromApi),
  add: (movieId) => api.post("/api/watchlist", { movie: movieId }, true),
  remove: (movieId) => api.del(`/api/watchlist/${movieId}`, true),
};
