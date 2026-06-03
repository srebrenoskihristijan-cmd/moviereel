import { Star } from "lucide-react";
export default function StarRating({ value, size = 15 }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size}
          fill={i <= Math.round(value) ? "var(--gold)" : "none"}
          color={i <= Math.round(value) ? "var(--gold)" : "var(--line2)"} />
      ))}
    </span>
  );
}
