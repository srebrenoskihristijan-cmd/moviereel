// Client-level validation using regular expressions (Part 4 requirement).
export const RE = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  hex: /^#[0-9a-fA-F]{6}$/,
  year: /^\d{4}$/,
};

export const validateRegister = ({ username, email, password, confirm }) => {
  const e = {};
  if (!RE.username.test(username || "")) e.username = "3–20 letters, numbers or underscores.";
  if (!RE.email.test(email || "")) e.email = "Enter a valid email address.";
  if (!password || password.length < 6) e.password = "At least 6 characters.";
  if (password !== confirm) e.confirm = "Passwords do not match.";
  return e;
};

export const validateLogin = ({ username, password }) => {
  const e = {};
  if (!username) e.username = "Username is required.";
  if (!password) e.password = "Password is required.";
  return e;
};

export const validateMovie = (f) => {
  const e = {};
  if (!f.title || !f.title.trim()) e.title = "Title is required.";
  const y = Number(f.year);
  if (!RE.year.test(String(f.year)) || y < 1888 || y > 2100) e.year = "Year must be 1888–2100.";
  if (!f.genre) e.genre = "Pick a genre.";
  if (!f.director || f.director.trim().length < 2) e.director = "Director is required.";
  if (f.runtime !== "" && f.runtime != null) {
    const rt = Number(f.runtime);
    if (!Number.isInteger(rt) || rt < 1 || rt > 600) e.runtime = "Runtime must be 1–600 minutes.";
  }
  if (f.accent && !RE.hex.test(f.accent)) e.accent = "Must be a hex colour like #e0a93f.";
  if (!f.overview || f.overview.trim().length < 10) e.overview = "Give at least 10 characters.";
  return e;
};

export const validateReview = ({ rating, text }) => {
  const e = {};
  if (!rating || rating < 1) e.rating = "Please choose a star rating.";
  if (!text || text.trim().length < 3) e.text = "Your review needs at least 3 characters.";
  if (text && text.length > 1000) e.text = "Reviews are capped at 1000 characters.";
  return e;
};
