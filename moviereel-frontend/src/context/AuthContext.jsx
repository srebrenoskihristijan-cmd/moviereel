import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/authService.js";
import { User } from "../models/User.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On load, if a JWT is stored, fetch the current user.
  useEffect(() => {
    const token = localStorage.getItem("mr_token");
    if (!token) { setReady(true); return; }
    authService.me()
      .then((d) => setUser(User.fromApi(d.user)))
      .catch(() => localStorage.removeItem("mr_token"))
      .finally(() => setReady(true));
  }, []);

  const handleAuth = (data) => {
    localStorage.setItem("mr_token", data.token);
    setUser(User.fromApi(data.user));
    return User.fromApi(data.user);
  };

  const login = async (creds) => handleAuth(await authService.login(creds));
  const register = async (payload) => handleAuth(await authService.register(payload));
  const logout = () => { localStorage.removeItem("mr_token"); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
