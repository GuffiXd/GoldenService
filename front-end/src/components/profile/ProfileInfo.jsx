// src/components/profile/ProfileInfo.jsx
import React from "react";
import { useAuth } from "../../context/useAuth";

export default function ProfileInfo() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Мои данные</h2>
      <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
        <div>
          <label className="text-sm text-gray-500">Имя</label>
          <p className="text-xl font-semibold">{user?.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="text-xl font-semibold">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Телефон</label>
          <p className="text-xl font-semibold">{user?.phone || "Не указан"}</p>
        </div>
      </div>
    </div>
  );
}