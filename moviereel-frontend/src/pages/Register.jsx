import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { validateRegister } from "../utils/validators.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    const e = validateRegister(form);
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try { await register({ username: form.username, email: form.email, password: form.password }); navigate("/"); }
    catch (err) { setErrs({ form: err.message }); }
    finally { setBusy(false); }
  };

  return (
    <div className="mr-auth">
      <h1>Create account</h1>
      <div className="sub">Join to rate and review films.</div>
      <div className="mr-field"><label>Username</label>
        <input className="mr-input" value={form.username} onChange={set("username")} />
        {errs.username && <div className="mr-err">{errs.username}</div>}</div>
      <div className="mr-field"><label>Email</label>
        <input className="mr-input" value={form.email} onChange={set("email")} />
        {errs.email && <div className="mr-err">{errs.email}</div>}</div>
      <div className="mr-field"><label>Password</label>
        <input type="password" className="mr-input" value={form.password} onChange={set("password")} />
        {errs.password && <div className="mr-err">{errs.password}</div>}</div>
      <div className="mr-field"><label>Confirm password</label>
        <input type="password" className="mr-input" value={form.confirm} onChange={set("confirm")} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {errs.confirm && <div className="mr-err">{errs.confirm}</div>}</div>
      {errs.form && <div className="mr-err">{errs.form}</div>}
      <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={submit} disabled={busy}>
        <UserPlus size={17} /> Register
      </button>
      <div className="mr-switch">Already have an account? <Link to="/login">Log in</Link></div>
    </div>
  );
}
