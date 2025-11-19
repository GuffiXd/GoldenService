// src/pages/Profile.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProfileLayout from "../components/profile/ProfileLayout";
import ProfileInfo from "../components/profile/ProfileInfo";
import Orders from "../components/profile/Orders";
import Addresses from "../components/profile/Addresses";
import Favorites from "../components/profile/Favorites";

export default function Profile() {
  const location = useLocation();


  if (location.pathname === "/profile" || location.pathname === "/profile/") {
    return <Navigate to="/profile/info" replace />;
  }

  return (
    <ProfileLayout>
      <Routes>
        <Route path="info" element={<ProfileInfo />} />
        <Route path="orders" element={<Orders />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/profile/info" replace />} />
      </Routes>
    </ProfileLayout>
  );
}