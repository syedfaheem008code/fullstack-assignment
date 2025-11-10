import React from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ScreensPage from "./pages/ScreensPage";
import PlaylistsPage from "./pages/PlaylistsPage";

const Private: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav style={{ display: "flex", gap: 8, padding: 8 }}>
          <Link to="/screens">Screens</Link>
          <Link to="/playlists">Playlists</Link>
          <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/screens" element={<Private><ScreensPage /></Private>} />
          <Route path="/playlists" element={<Private><PlaylistsPage /></Private>} />
          <Route path="*" element={<Navigate to="/screens" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
