// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import api from "../config/api"; // Используем общий конфиг
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Устанавливаем токен перед запросом, если его нет в дефолтах
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/api/auth/me");
        setUser(res.data.user || res.data);
      } catch (error) {
        console.log("Ошибка проверки токена:", error.message);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const register = async (userData) => {
    const { data } = await api.post("/api/auth/register", userData);
    localStorage.setItem("token", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}