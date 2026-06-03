import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
// Route guard: requires a logged-in user, optionally an admin.
export default function ProtectedRoute({ children, admin = false }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
}
