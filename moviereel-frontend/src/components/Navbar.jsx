import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { Film, Home as HomeIcon, Search, Shield, LogIn, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e) => {
    if (e.key === "Enter" && q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); setQ(""); }
  };
  const cls = ({ isActive }) => "mr-navbtn" + (isActive ? " on" : "");

  return (
    <header className="mr-head">
      <div className="mr-wrap mr-head-in">
        <Link to="/" className="mr-logo"><Film size={22} color="var(--gold)" /> Movie<span className="dot">Reel</span></Link>
        <nav className="mr-nav">
          <NavLink to="/" end className={cls}><HomeIcon size={16} /> Home</NavLink>
          <NavLink to="/search" className={cls}><Search size={16} /> Search</NavLink>
          {user?.isAdmin && <NavLink to="/admin" className={cls}><Shield size={16} /> Admin</NavLink>}
        </nav>
        <div className="mr-spacer" />
        <div className="mr-search-mini">
          <Search size={16} />
          <input placeholder="Quick search…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={submit} />
        </div>
        {user ? (
          <div className="mr-user">
            <span className={"mr-chip " + (user.isAdmin ? "admin" : "user")}>{user.role}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{user.username}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate("/"); }}><LogOut size={15} /></button>
          </div>
        ) : (
          <div className="mr-user">
            <Link to="/login" className="btn btn-ghost btn-sm"><LogIn size={15} /> Log in</Link>
            <Link to="/register" className="btn btn-gold btn-sm"><UserPlus size={15} /> Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
