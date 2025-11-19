// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";


const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});


const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user || res.data);
      } catch (error) {
        console.log("Ошибка проверки токена:", error.message)
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}