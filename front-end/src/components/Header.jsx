import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";

const API_URL = "http://localhost:5000";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Создаём debounced функцию через useRef — один раз
  const debouncedSearchRef = useRef(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/locks/search?q=${encodeURIComponent(query.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5));
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Ошибка поиска:", err);
        setSearchResults([]);
      }
    }, 300)
  );

  // Запуск поиска
  useEffect(() => {
    debouncedSearchRef.current(searchQuery);
  }, [searchQuery]);

  // Очистка при размонтировании
  useEffect(() => {
    const currentDebounce = debouncedSearchRef.current;
    return () => {
      currentDebounce.cancel();
    };
  }, []);

  // Закрытие при клике вне
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
    setSearchResults([]);
    navigate(`/product/${lock.id}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) setShowResults(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* === ЛОГО === */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-lg">G</span>
            </div>
            <span className="text-2xl font-black text-gray-900">GoldenSoft</span>
          </Link>

          {/* === ПОИСК (десктоп) === */}
          <div className="hidden md:block flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Поиск замков..."
                className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              {/* === РЕЗУЛЬТАТЫ === */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  {searchResults.map((lock) => (
                    <button
                      key={lock.id}
                      onClick={() => handleResultClick(lock)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={`${API_URL}${lock.image_path}`}
                        alt={lock.name}
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{lock.name}</p>
                        <p className="text-sm text-indigo-600 font-semibold">
                          {lock.price_with_discount || lock.price}₽
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === ИКОНКИ === */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/favorites" className="relative group" aria-label="Корзина">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-xl text-gray-700 group-hover:text-indigo-600 transition-colors"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </Link>

            <Link to="/profile" className="group" aria-label="Профиль">
              <FontAwesomeIcon
                icon={faUser}
                className="text-xl text-gray-700 group-hover:text-indigo-600 transition-colors"
              />
            </Link>
          </div>

          {/* === МОБИЛЬНОЕ МЕНЮ === */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label="Меню"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="text-2xl text-gray-700"
            />
          </button>
        </div>

        {/* === МОБИЛЬНОЕ МЕНЮ === */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Поиск..."
                className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex justify-center space-x-8 pt-4">
              <Link to="/favorites" className="text-gray-700">
                <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
              </Link>
              <Link to="/profile" className="text-gray-700">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;