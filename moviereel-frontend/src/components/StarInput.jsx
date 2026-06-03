import { useState } from "react";
import { Star } from "lucide-react";
export default function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={26} className="star-in"
          onMouseEnter={() => setHover(i)} onClick={() => onChange(i)}
          fill={i <= (hover || value) ? "var(--gold)" : "none"}
          color={i <= (hover || value) ? "var(--gold)" : "var(--line2)"} />
      ))}
    </span>
  );
}
