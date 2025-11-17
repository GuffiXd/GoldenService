// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useAuth } from "../../context/useAuth";
import { API_URL } from "../../config/api";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const cartItemsCount = 0; // потом заменишь на useCart()

  // Debounced поиск
  const debouncedSearch = useRef(
    debounce((query) => {
      if (!query?.trim() || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      fetch(`${API_URL}/api/locks/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setSearchResults(data.slice(0, 6)))
        .catch(() => setSearchResults([]));
    }, 350)
  ).current;

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (lock) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/product/${lock.id}`);
  };

  // Компонент авторизации с loading
  const AuthSection = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-4">
          <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium hidden sm:block">
            Привет, {user.name.split(" ")[0]}!
          </span>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-600 transition"
            title="Выйти"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => navigate("/auth")}
        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition shadow-lg"
      >
        <FontAwesomeIcon icon={faUser} />
        <span>Войти</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ЛОГО */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <span className="text-white font-black text-2xl">G</span>
            </div>
            <span className="text-2xl font-black text-gray-900 hidden sm:block">GoldenSoft</span>
          </Link>

          {/* ПОИСК — ДЕСКТОП */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-10" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) setShowResults(true);
                }}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Поиск замков..."
                className="w-full px-6 py-4 pl-14 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-lg"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
              />

              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {searchResults.map((lock) => (
                    <button
                      key={lock.id}
                      onClick={() => handleResultClick(lock)}
                      className="w-full px-6 py-5 flex items-center gap-5 hover:bg-gray-50 transition-all text-left border-b border-gray-50 last:border-0"
                    >
                      <img
                        src={`${API_URL}${lock.image_path}`}
                        alt={lock.name}
                        className="w-16 h-16 object-cover rounded-xl bg-gray-50 shadow-sm"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 line-clamp-1">{lock.name}</p>
                        <p className="text-sm text-gray-500">{lock.short_description || "Умный замок"}</p>
                      </div>
                      <p className="text-xl font-bold text-indigo-600">
                        {(lock.price_with_discount || lock.price).toLocaleString()} ₽
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — ДЕСКТОП */}
          <div className="hidden lg:flex items-center space-x-8">
            <button onClick={() => navigate("/cart")} className="relative group" aria-label="Корзина">
              <FontAwesomeIcon icon={faShoppingCart} className="text-2xl text-gray-700 group-hover:text-indigo-600 transition" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <AuthSection />
          </div>

          {/* МОБИЛЬНАЯ КНОПКА */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-2xl text-gray-700"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* МОБИЛЬНОЕ МЕНЮ */}
        {isMenuOpen && (
          <div className="lg:hidden pb-8 pt-4 border-t border-gray-100">
            <div className="mb-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск замков..."
                className="w-full px-5 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/  -translate-y-1/2 text-gray-400 text-xl" />
            </div>

            <div className="flex flex-col space-y-6 text-center">
              {loading ? (
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              ) : user ? (
                <>
                  <p className="text-lg font-semibold text-gray-800">
                    Привет, {user.name.split(" ")[0]}!
                  </p>
                  <button onClick={() => { navigate("/profile"); setIsMenuOpen(false); }} className="text-indigo-600 font-bold text-lg">
                    Личный кабинет
                  </button>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-600 font-bold text-lg">
                    Выйти
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
                >
                  Войти в аккаунт
                </button>
              )}

              <button
                onClick={() => { navigate("/cart"); setIsMenuOpen(false); }}
                className="flex items-center justify-center gap-3 text-gray-700"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
                <span className="font-bold text-xl">
                  Корзина {cartItemsCount > 0 && `(${cartItemsCount})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;