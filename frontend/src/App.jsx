import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import FilmsPage from "./pages/FilmsPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<FilmsPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <AuthModal />
    </div>
  );
}
