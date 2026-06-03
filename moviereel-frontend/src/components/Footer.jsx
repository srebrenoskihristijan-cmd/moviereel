export default function Footer() {
  return (
    <footer className="mr-foot">
      <div className="mr-wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <span className="mr-disp" style={{ fontWeight: 900, fontSize: 16, color: "var(--paper)" }}>
          Movie<span style={{ color: "var(--gold)" }}>Reel</span>
        </span>
        <span>Connected to the MovieReel REST API · guest · user · admin</span>
      </div>
    </footer>
  );
}
