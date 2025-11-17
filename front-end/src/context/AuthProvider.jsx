// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";  // ← импортируем отсюда
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const interceptor = axios.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    if (token) {
      axios
        .get(`${API_URL}/api/auth/me`)
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (userData) => {
    const { data } = await axios.post(`${API_URL}/api/auth/register`, userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}