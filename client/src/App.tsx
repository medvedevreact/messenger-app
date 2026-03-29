import type React from "react";
import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import Auth from "./pages/Auth/Auth";
import { THEME_STORAGE_KEY } from "./store/slices/theme";
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    const saved =
      localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
