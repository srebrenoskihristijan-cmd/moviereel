// Transformation pipes — pure functions used across components (Part 4: >= 5 pipes).
// 1) runtime in minutes -> "2h 22m"
export const formatRuntime = (min) => {
  if (!min) return "—";
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};
// 2) numeric rating -> one decimal or em dash
export const formatRating = (n) => (n ? Number(n).toFixed(1) : "—");
// 3) truncate long text
export const truncate = (text = "", n = 120) =>
  text.length > n ? text.slice(0, n).trimEnd() + "…" : text;
// 4) ISO date -> localized date
export const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch { return iso; }
};
// 5) count + word -> pluralized label
export const pluralize = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
// 6) genre (object or id) -> display name
export const genreName = (genre) =>
  genre && typeof genre === "object" ? genre.name : genre || "—";
