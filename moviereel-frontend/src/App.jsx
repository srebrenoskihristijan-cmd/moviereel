import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="mr-root">
        <div className="mr-grain" />
        <div className="mr-glow" style={{ width: 480, height: 480, background: "var(--gold)", opacity: 0.10, top: -120, right: -80 }} />
        <div className="mr-glow" style={{ width: 420, height: 420, background: "var(--red)", opacity: 0.09, top: 280, left: -120 }} />

        <Navbar />
        <main className="mr-wrap" style={{ paddingBottom: 40, minHeight: "60vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
