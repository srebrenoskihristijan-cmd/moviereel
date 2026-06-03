import { api } from "./client.js";
import { Genre } from "../models/Genre.js";
// Service: genres (own REST API).
export const genreService = {
  list: async () => (await api.get("/api/genres")).map(Genre.fromApi),
};
