// Renders a movie "poster": real TMDB image if present, else a gradient by accent.
function shade(hex, amt) {
  let c = (hex || "#e0a93f").replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const n = parseInt(c, 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return `rgb(${r},${g},${b})`;
}

export default function Poster({ movie, big = false }) {
  if (movie?.posterUrl) {
    return <div className="mr-poster-bg" style={{ position: "absolute", inset: 0,
      backgroundImage: `url(${movie.posterUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />;
  }
  const a = movie?.accent || "#5b8def";
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(155deg, ${a} 0%, ${shade(a, -55)} 100%)` }}>
      {big && <span className="big">{(movie?.title || "?")[0]}</span>}
    </div>
  );
}
