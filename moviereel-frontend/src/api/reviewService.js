import { api } from "./client.js";
import { Review } from "../models/Review.js";
// Service: reviews (own REST API).
export const reviewService = {
  listByMovie: async (movieId) =>
    (await api.get(`/api/reviews?movie=${movieId}`)).map(Review.fromApi),
  listAll: async () => (await api.get("/api/reviews")).map(Review.fromApi),
  save: (payload) => api.post("/api/reviews", payload, true),
  remove: (id) => api.del(`/api/reviews/${id}`, true),
};
