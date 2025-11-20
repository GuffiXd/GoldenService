// src/components/profile/ProfileLayout.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ← добавил useNavigate
import { useAuth } from "../../context/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBoxOpen,
  faMapMarkerAlt,
  faHeart,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast"; // если у тебя есть тосты — оставь, если нет — удали строку с toast

const tabs = [
  { to: "/profile/info", icon: faUser, label: "Мои данные" },
  { to: "/profile/orders", icon: faBoxOpen, label: "Заказы" },
  { to: "/profile/addresses", icon: faMapMarkerAlt, label: "Адреса доставки" },
  { to: "/profile/favorites", icon: faHeart, label: "Избранное" },
];

export default function ProfileLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ← магия редиректа

  const handleLogout = () => {
    logout(); // очищаем контекст и localStorage
    toast.success("Вы успешно вышли из аккаунта"); // опционально
    navigate("/", { replace: true }); // ← мгновенно на главную
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Шапка профиля */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-black">
                {user?.name?.[0]?.toUpperCase() || "А"}
              </div>
              <div>
                <h1 className="text-4xl font-black">
                  Привет, {user?.name?.split(" ")[0] || "Гость"}!
                </h1>
                <p className="text-white/80 text-lg mt-1">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Боковое меню */}
            <aside className="lg:w-80 bg-gray-50 border-r border-gray-200">
              <nav className="p-6 space-y-2">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={tab.icon} />
                    <span>{tab.label}</span>
                  </NavLink>
                ))}

                {/* КНОПКА ВЫХОДА С РЕДИРЕКТОМ */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium text-red-600 hover:bg-red-50 transition-all mt-8"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Выйти</span>
                </button>
              </nav>
            </aside>

            {/* Основной контент */}
            <main className="flex-1 p-8 lg:p-12">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}