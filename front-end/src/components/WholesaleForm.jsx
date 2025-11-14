import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const API_URL = "http://localhost:5000/api/orders";

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

  const searchRef = useRef(null);

  // Поиск замков
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`)
          .then((res) => res.json())
          .then((data) => setSuggestions(data))
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

  const selectLock = (lock) => {
    setSelectedLock(lock);
    setSearchQuery(`${lock.name} (${lock.article || "без артикула"})`);
    setShowSuggestions(false);
  };

  const getPrice = () => {
    if (!selectedLock) return 0;
    return selectedLock.price_with_discount &&
      selectedLock.price_with_discount > 0
      ? selectedLock.price_with_discount
      : selectedLock.price;
  };

  const calculateTotal = () => {
    if (!selectedLock) return "—";
    const total = getPrice() * form.quantity;
    return total.toFixed(2);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Введите имя";
    if (!form.phone.trim()) newErrors.phone = "Введите телефон";
    if (!selectedLock) newErrors.product = "Выберите товар";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lockId: selectedLock.id,
          totalCost: parseFloat(calculateTotal().replace(",", "")),
        }),
      });

      if (!res.ok) throw new Error("Ошибка сервера");

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

      setTimeout(() => setShowModal(false), 2500);
    } catch (err) {
      alert(err.message || "Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full h-full mx-auto px-56 py-16 bg-[#F2F8FF]">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Левая часть — по центру */}
          <div className="flex flex-col justify-center items-center space-y-6 text-center px-4 py-20">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Оформите заявку и мы вам перезвоним
            </h1>
            <p className="text-gray-600 leading-relaxed text-base max-w-2xl">
              Мы предлагаем современные электронные замки для любых задач:
              квартиры, дома, офиса, отеля или раздевалки. Надёжная защита,
              удобное управление и профессиональная установка. Оставьте заявку —
              и наш менеджер свяжется с вами в течение 15 минут.
            </p>
          </div>

          {/* Форма */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Оформление заявки
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Строка 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ваше имя"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название компании
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition"
                    placeholder="Имя Вашей компании"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Номер телефона
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+7 (___) ___-__-__"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Строка 2 */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                ref={searchRef}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название товара
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
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
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition ${
                        errors.product ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Введите название или артикул"
                    />
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((lock) => (
                        <div
                          key={lock.id}
                          onClick={() => selectLock(lock)}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0"
                        >
                          <div className="font-medium">{lock.name}</div>
                          <div className="text-xs text-gray-500">
                            Артикул: {lock.article || "—"} |{" "}
                            {lock.price_with_discount ? (
                              <span>
                                <del>{lock.price}₽</del> →{" "}
                                <strong>{lock.price_with_discount}₽</strong>
                              </span>
                            ) : (
                              <strong>{lock.price}₽</strong>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.product && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.product}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4295E4] transition"
                    placeholder="Количество"
                  />
                </div>
              </div>

              {/* Чекбоксы */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="logo"
                    checked={form.logo}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#4295E4] rounded focus:ring-[#4295E4] border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Нанесение персонального логотипа (бесплатно)
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="installation"
                    checked={form.installation}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#4295E4] rounded focus:ring-[#4295E4] border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Помощь в монтажных работах (бесплатно)
                  </span>
                </label>
              </div>

              {/* Стоимость */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Приблизительная стоимость
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-900">
                    {calculateTotal()} ₽
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedLock}
                  className={`mt-6 px-8 py-3 bg-[#4295E4] text-white font-medium rounded-lg hover:bg-[#2f7acc] transition shadow-sm ${
                    isSubmitting || !selectedLock
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Отправка..." : "Отправить заявку"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Модалка */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white rounded-2xl p-8 max-w-sm mx-auto outline-none shadow-2xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-green-600"
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Спасибо!</h3>
          <p className="text-gray-600">Мы с вами свяжемся в ближайшее время.</p>
        </div>
      </Modal>
    </>
  );
}

export default OrderForm;
