// src/components/sections/WholesaleForm.jsx
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

Modal.setAppElement("#root");

const BASE_API_URL = "http://localhost:5000";

function AnimatedNumber({ value }) {
  return (
    <Motion.span
      key={value}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="font-black text-3xl text-indigo-600"
    >
      {value.toLocaleString("ru-RU")} ₽
    </Motion.span>
  );
}

export default function WholesaleForm() {
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

  const searchRef = useRef(null);

  // Поиск товаров
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetch(`${BASE_API_URL}/api/locks/search?q=${encodeURIComponent(searchQuery)}`)
          .then((res) => {
            if (!res.ok) throw new Error("Ошибка поиска");
            return res.json();
          })
          .then((data) => setSuggestions(Array.isArray(data) ? data.slice(0, 5) : []))
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
    if (numbers.length === 11 && numbers.startsWith("7")) {
      const m = numbers.slice(1).match(/(\d{3})(\d{3})(\d{2})(\d{2})/);
      if (m) return `+7 (${m[1]}) ${m[2]}-${m[3]}-${m[4]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  const selectLock = (lock) => {
    setSelectedLock(lock);
    setSearchQuery(lock.name);
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
    return selectedLock.price_with_discount || selectedLock.price;
  };

  const calculateTotal = () => getPrice() * form.quantity;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Введите имя";
    if (form.phone.replace(/\D/g, "").length !== 11) newErrors.phone = "Неверный телефон";
    if (!selectedLock) newErrors.product = "Выберите товар";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await fetch(`${BASE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lockId: selectedLock.id,
          totalCost: calculateTotal(),
        }),
      });

      setShowModal(true);
      setForm({ name: "", company: "", phone: "", quantity: 1, logo: false, installation: false });
      setSelectedLock(null);
      setSearchQuery("");
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      alert("Ошибка отправки заявки",err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Левая часть */}
          <Motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Оформите заявку
            </h1>
            <p className="text-xl text-gray-700">
              Мы перезвоним <span className="text-indigo-600 font-bold">в течение 15 минут</span>
            </p>
            <div className="flex justify-center lg:justify-start gap-6 mt-8">
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
          <Motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Поля формы */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Имя" className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500" required />
                <input name="company" value={form.company} onChange={handleChange} placeholder="Компания" className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500" />
                <input name="phone" value={form.phone} onChange={handlePhoneChange} placeholder="+7 (___) ___-__-__" className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500" required />
              </div>

              {/* Поиск */}
              <div ref={searchRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder="Поиск товара..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500"
                  />
                </div>

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-2xl"
                    >
                      {suggestions.map((lock) => (
                        <div
                          key={lock.id}
                          onClick={() => selectLock(lock)}
                          className="p-4 hover:bg-indigo-50 cursor-pointer flex items-center gap-4"
                        >
                          <img
                            src={`${BASE_API_URL}${lock.image_path}`}
                            alt={lock.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold">{lock.name}</p>
                            <p className="text-xs text-gray-500">Арт: {lock.article || "—"}</p>
                          </div>
                        </div>
                      ))}
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Выбранный товар */}
              {selectedLock && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold">{selectedLock.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          Арт: {selectedLock.article}
                          <button onClick={copyArticle}>
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <AnimatedNumber value={calculateTotal()} />
                      <p className="text-xs text-gray-500">x{form.quantity} шт</p>
                    </div>
                  </div>
                </Motion.div>
              )}

              {/* Количество и чекбоксы */}
              <div className="flex items-center gap-8">
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-24 px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500"
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

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all shadow-xl disabled:opacity-70"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
                <ArrowRight className="inline ml-2 w-6 h-6" />
              </button>
            </form>
          </Motion.div>
        </div>
      </div>

      {/* Модалка успеха */}
      <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  shouldCloseOnOverlayClick={true}
  shouldCloseOnEsc={true}
  closeTimeoutMS={300}
  style={{
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "1rem",
    },
    content: {
      position: "relative",
      inset: "auto",
      border: "none",
      background: "transparent",
      padding: 0,
      maxWidth: "440px",
      width: "100%",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.35)",
    },
  }}
>
  <Motion.div
    initial={{ scale: 0.7, opacity: 0, y: 50 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.8, opacity: 0, y: -30 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
    className="bg-white rounded-3xl p-10 text-center shadow-3xl relative overflow-hidden"
  >
    {/* Фоновый градиент */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
    
    {/* Контент */}
    <div className="relative z-10">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
        <Check className="w-14 h-14 text-white" strokeWidth={3} />
      </div>

      <h3 className="text-4xl font-black text-gray-900 mb-3">
        Готово!
      </h3>
      
      <p className="text-lg text-gray-600 mb-2">
        Ваша заявка успешно отправлена
      </p>
      
      <p className="text-sm text-gray-500">
        Мы свяжемся с вами <span className="text-indigo-600 font-bold">в течение 15 минут</span>
      </p>

      {/* Автозакрытие */}
      <div className="mt-8 text-xs text-gray-400">
        Закроется автоматически через 3 сек...
      </div>
    </div>

    {/* Декоративные кружки */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
  </Motion.div>
</Modal>
    </div>
  );
}