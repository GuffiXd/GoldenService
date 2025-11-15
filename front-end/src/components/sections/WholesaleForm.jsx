import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { motion as Motion, AnimatePresence } from "framer-motion"; // ← ФИКС
import {
  Search,
  Package,
  Copy,
  Check,
  Phone,
  Building,
  Hash,
  ArrowRight,
  Sparkles,
} from "lucide-react";

Modal.setAppElement("#root");

const API_URL = "http://localhost:5000/api/orders";

function AnimatedNumber({ value }) {
  return (
    <Motion.span
      key={value}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="font-black text-2xl text-indigo-600"
    >
      {value.toLocaleString("ru-RU")} ₽
    </Motion.span>
  );
}

function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    quantity: 1,
    logo: false,
    installation: false,
  });

  const [selectedLock, setSelectedLock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const searchRef = useRef(null);

  // Темная тема
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  // Поиск
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`)
          .then((res) => res.json())
          .then((data) => setSuggestions(data.slice(0, 5)))
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Закрытие подсказок
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("7")) {
      const formatted = numbers
        .slice(1)
        .match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (formatted) {
        return `+7 (${formatted[1]}${formatted[2] ? ") " + formatted[2] : ""}${
          formatted[3] ? "-" + formatted[3] : ""
        }${formatted[4] ? "-" + formatted[4] : ""}`;
      }
    }
    return value;
  };

  const selectLock = (lock) => {
    setSelectedLock(lock);
    setSearchQuery(`${lock.name} (${lock.article || "без артикула"})`);
    setShowSuggestions(false);
  };

  const copyArticle = () => {
    if (selectedLock?.article) {
      navigator.clipboard.writeText(selectedLock.article);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPrice = () => {
    if (!selectedLock) return 0;
    return selectedLock.price_with_discount > 0
      ? selectedLock.price_with_discount
      : selectedLock.price;
  };

  const calculateTotal = () => {
    if (!selectedLock) return 0;
    return getPrice() * form.quantity;
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Введите имя";
    if (!form.phone.replace(/\D/g, "").length === 11)
      newErrors.phone = "Неверный телефон";
    if (!selectedLock) newErrors.product = "Выберите товар";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lockId: selectedLock.id,
          totalCost: calculateTotal(),
        }),
      });

      setShowModal(true);
      setForm({
        name: "",
        company: "",
        phone: "",
        quantity: 1,
        logo: false,
        installation: false,
      });
      setSelectedLock(null);
      setSearchQuery("");
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      console.error("Ошибка отправки формы:", err); // ← Добавлено
      alert("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`min-h-max py-20 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Левая часть */}
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Оформите заявку
              </h1>
              <p
                className={`text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } leading-relaxed`}
              >
                Мы перезвоним{" "}
                <span className="text-indigo-600 font-bold">
                  в течение 15 минут
                </span>{" "}
                и подберём идеальное решение под ваш бизнес
              </p>
              <div className="flex justify-center lg:justify-start gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <span className="font-medium">Бесплатная установка</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium">От 10 штук</span>
                </div>
              </div>
            </Motion.div>

            {/* Форма */}
            <Motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`relative ${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-3xl shadow-2xl p-8 backdrop-blur-xl`}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-50" />

              <h2 className="text-3xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Заявка на опт
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Имя + Компания + Телефон */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Имя"
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                        errors.name ? "border-red-400" : "border-gray-300"
                      } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition`}
                    />
                  </div>
                  <div>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Компания"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition"
                    />
                  </div>
                  <div>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setForm((prev) => ({ ...prev, phone: formatted }));
                      }}
                      placeholder="+7 (___) ___-__-_"
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${
                        errors.phone ? "border-red-400" : "border-gray-300"
                      } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition`}
                    />
                  </div>
                </div>

                {/* Поиск товара */}
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        setSelectedLock(null);
                      }}
                      onFocus={() =>
                        searchQuery.length >= 2 && setShowSuggestions(true)
                      }
                      placeholder="Поиск по названию или артикулу..."
                      className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border ${
                        errors.product ? "border-red-400" : "border-gray-300"
                      } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition`}
                    />
                  </div>

                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <Motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                      >
                        {suggestions.map((lock) => (
                          <div
                            key={lock.id}
                            onClick={() => selectLock(lock)}
                            className="p-4 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-4"
                          >
                            <img
                              src={`${API_URL.replace(
                                "/api/orders",
                                ""
                              )}/images/locks/${lock.image || "default.webp"}`}
                              alt={lock.name}
                              className="w-12 h-12 rounded-lg object-cover shadow"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {lock.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Арт: {lock.article || "—"}
                              </p>
                            </div>
                            <div className="text-right">
                              {lock.price_with_discount ? (
                                <div>
                                  <del className="text-xs text-gray-400">
                                    {lock.price}₽
                                  </del>
                                  <p className="font-bold text-indigo-600">
                                    {lock.price_with_discount}₽
                                  </p>
                                </div>
                              ) : (
                                <p className="font-bold text-indigo-600">
                                  {lock.price}₽
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Выбранный товар */}
                <AnimatePresence>
                  {selectedLock && (
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-inner"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {selectedLock.name}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Hash className="w-4 h-4" />
                              {selectedLock.article}
                              <button
                                onClick={copyArticle}
                                className="ml-2 p-1 rounded hover:bg-white/50 transition"
                              >
                                {copied ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-indigo-600">
                            <AnimatedNumber
                              value={getPrice() * form.quantity}
                            />
                          </p>
                          <p className="text-xs text-gray-500">
                            x{form.quantity} шт
                          </p>
                        </div>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>

                {/* Количество + Чекбоксы */}
                <div className="flex items-center gap-4">
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    className="w-24 px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition"
                  />
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="logo"
                        checked={form.logo}
                        onChange={handleChange}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="text-sm">Логотип</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="installation"
                        checked={form.installation}
                        onChange={handleChange}
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="text-sm">Монтаж</span>
                    </label>
                  </div>
                </div>

                {/* Кнопка */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedLock}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </Motion.div>
          </div>
        </div>
      </div>

      {/* Модалка с Lottie */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md mx-4 p-8 outline-none"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      >
        <div className="text-center">
          // Вместо Lottie
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">Готово!</h3>
          <p className="text-gray-600">Мы свяжемся с вами в течение 15 минут</p>
        </div>
      </Modal>
    </>
  );
}

export default OrderForm;
