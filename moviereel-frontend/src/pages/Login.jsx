import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { validateLogin } from "../utils/validators.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    const e = validateLogin(form);
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try { await login(form); navigate("/"); }
    catch (err) { setErrs({ form: err.message }); }
    finally { setBusy(false); }
  };

  return (
    <div className="mr-auth">
      <h1>Welcome back</h1>
      <div className="sub">Log in to rate and review films.</div>
      <div className="mr-field"><label>Username</label>
        <input className="mr-input" value={form.username} onChange={set("username")} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {errs.username && <div className="mr-err">{errs.username}</div>}</div>
      <div className="mr-field"><label>Password</label>
        <input type="password" className="mr-input" value={form.password} onChange={set("password")} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {errs.password && <div className="mr-err">{errs.password}</div>}</div>
      {errs.form && <div className="mr-err">{errs.form}</div>}
      <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={submit} disabled={busy}>
        <LogIn size={17} /> Log in
      </button>
      <div className="mr-switch">No account yet? <Link to="/register">Register</Link></div>
      <div className="mr-hintbox">Demo logins — admin: <b>admin / admin123</b> · user: <b>cinephile / demo123</b></div>
    </div>
  );
}
