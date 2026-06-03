// Thin fetch wrapper: prefixes the API base URL, attaches the JWT, parses JSON
// and throws a readable Error on non-2xx responses.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getToken = () => localStorage.getItem("mr_token");

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || data.errors?.[0]?.msg || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (p, auth = false) => request(p, { auth }),
  post: (p, body, auth = false) => request(p, { method: "POST", body, auth }),
  put: (p, body, auth = false) => request(p, { method: "PUT", body, auth }),
  del: (p, auth = false) => request(p, { method: "DELETE", auth }),
};
