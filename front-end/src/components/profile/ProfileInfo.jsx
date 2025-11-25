// src/components/profile/ProfileInfo.jsx
import React from "react";
import { useAuth } from "../../context/useAuth";
import { User, Mail, Phone, Edit3 } from "lucide-react";

export default function ProfileInfo() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Мои данные</h2>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-black shadow-lg">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{user?.name || "Пользователь"}</h3>
              <span className="inline-block mt-2 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                {user?.role === "admin" ? "Администратор" : "Покупатель"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Имя пользователя</p>
              <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email адрес</p>
              <p className="text-lg font-bold text-gray-900">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Телефон</p>
              <p className="text-lg font-bold text-gray-900">{user?.phone || "Не указан"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}