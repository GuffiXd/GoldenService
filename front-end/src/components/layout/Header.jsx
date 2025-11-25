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
import { useCart } from "../../context/CartContext"; // Import useCart
import { API_URL } from "../../config/api";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { cart, totalPrice } = useCart(); // Get cart and totalPrice

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);


  const debouncedSearch = useRef(
    debounce((query) => {
      if (!query?.trim() || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      fetch(`${API_URL}/api/locks/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setSearchResults(Array.isArray(data) ? data.slice(0, 6) : []))
        .catch(() => setSearchResults([]));
    }, 350)
  ).current;

  useEffect(() => debouncedSearch(searchQuery), [searchQuery, debouncedSearch]);

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


  const getUserInitial = () => {
    if (!user?.name) return "?";
    return user.name.trim().charAt(0).toUpperCase();
  };


  const getUserFirstName = () => {
    if (!user?.name) return "";
    return user.name.split(" ")[0];
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
                      <p className="text-indigo-600 font-bold text-lg whitespace-nowrap">
                        {lock.price?.toLocaleString()} ₽
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {getUserInitial()}
                      </div>
                      <span className="font-semibold text-gray-900">{getUserFirstName()}</span>
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-full transition"
                      >
                        Админка
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-full transition"
                      title="Выйти"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Войти</span>
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="relative p-3 text-gray-700 hover:bg-gray-100 rounded-full transition"
                  title="Корзина"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-full transition"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) setShowResults(true);
                }}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Поиск замков..."
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((lock) => (
                    <button
                      key={lock.id}
                      onClick={() => handleResultClick(lock)}
                      className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-all text-left border-b border-gray-50 last:border-0"
                    >
                      <img
                        src={`${API_URL}${lock.image_path}`}
                        alt={lock.name}
                        className="w-14 h-14 object-cover rounded-lg bg-gray-50"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 line-clamp-1 text-sm">{lock.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{lock.short_description || "Умный замок"}</p>
                      </div>
                      <p className="text-indigo-600 font-bold text-sm whitespace-nowrap">
                        {lock.price?.toLocaleString()} ₽
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!loading && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <div className="flex flex-col items-center gap-3 pb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {getUserInitial()}
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        Привет, {getUserFirstName()}!
                      </p>
                    </div>
                    <button
                      onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
                      className="w-full text-center py-3 text-indigo-600 font-bold text-lg hover:bg-indigo-50 rounded-xl transition"
                    >
                      Личный кабинет
                    </button>
                    {user.role === "admin" && (
                      <button
                        onClick={() => { navigate("/admin"); setIsMenuOpen(false); }}
                        className="w-full text-center py-3 text-indigo-600 font-bold text-lg hover:bg-indigo-50 rounded-xl transition"
                      >
                        Админка
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full text-center py-3 text-red-600 font-bold text-lg hover:bg-red-50 rounded-xl transition"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition"
                  >
                    Войти в аккаунт
                  </button>
                )}
                <button
                  onClick={() => { navigate("/cart"); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 py-4 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-2xl transition"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
                  <span className="font-bold text-xl">
                    Корзина {cartItemsCount > 0 && `(${cartItemsCount})`}
                  </span>
                  {totalPrice > 0 && (
                    <span className="font-bold text-indigo-600 text-xl">
                      — {totalPrice.toLocaleString()} ₽
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;