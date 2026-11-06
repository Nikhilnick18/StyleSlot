
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SalonDetails from "./pages/SalonDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import "./App.css";

const ADMIN_UID = "bWaiHqbZ1sRWvYYbfL9u0JavV493";

function AdminRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <p>Checking access...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/salon/:slug" element={<SalonDetails />} />
      <Route path="/booking/:slug" element={<Booking />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
