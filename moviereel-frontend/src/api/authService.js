import { api } from "./client.js";
// Service: authentication against our own REST API.
export const authService = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  me: () => api.get("/api/auth/me", true),
};
