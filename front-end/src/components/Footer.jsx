import React, { useState } from "react";
import Modal from "react-modal";

const API_URL = "http://localhost:5000";

// Для доступности react-modal
Modal.setAppElement("#root");

function Footer() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Введите ваше имя";
    else if (formData.name.trim().length < 2) newErrors.name = "Имя слишком короткое";

    if (!formData.email.trim()) newErrors.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Некорректный email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/form/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Ошибка сервера");
      }

      // Успех
      setFormData({ name: "", email: "" });
      setErrors({});
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 2500);
    } catch (err) {
      alert(err.message || "Ошибка отправки. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="bg-[#0F172A] text-white">
        {/* Верхняя часть — форма */}
        <div className="w-full bg-[#F2F8FF] py-16 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Мы вам перезвоним</h1>
          <p className="max-w-[600px] text-gray-700 mb-10 px-4">
            Если у вас возникли вопросы или проблемы, заполните форму и мы с вами свяжемся.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 max-w-xl w-full px-4"
          >
            <div className="flex-1">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ваше имя"
                disabled={isSubmitting}
                className={`bg-white border text-black px-4 w-full h-[50px] rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 text-left">{errors.name}</p>}
            </div>

            <div className="flex-1">
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ваш Email"
                disabled={isSubmitting}
                className={`bg-white border text-black px-4 w-full h-[50px] rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#4295E4] text-white text-sm font-semibold rounded-md w-full md:w-[240px] h-[50px] hover:bg-[#2f7acc] transition-all transform shadow-md flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Отправка..." : "Отправить"}
            </button>
          </form>
        </div>

        {/* Нижняя часть — контакты */}
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="flex flex-wrap justify-between items-start gap-8">
            <div>
              <img src={`${API_URL}/images/icons/logo-footer.svg`} alt="GoldenService" className="h-16" />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Навигация</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#4295E4] transition">Главная</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Каталог</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Оптовая продажа</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">О нас</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Контакты</h3>
              <div className="space-y-3 text-gray-400">
                <p className="font-medium text-white">Телефоны</p>
                <p>+7 (988) 565 00 38</p>
                <p>+375 33 662 82 56</p>
                <p className="font-medium text-white mt-2">Email</p>
                <p>vladpertcev@mail.ru</p>
                <p>korobko416@gmail.com</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Адрес</h3>
              <p className="text-gray-400">
                Россия,<br />
                Ростов-на-Дону ул. Богачева, 16
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Информация</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#4295E4] transition">Доставка и оплата</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Гарантии</a></li>
                <li><a href="#" className="hover:text-[#4295E4] transition">Возврат товара</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-500">© 2021 Golden Soft All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Модальное окно успеха с анимацией */}
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        className="bg-white rounded-2xl shadow-2xl max-w-sm mx-4 p-8 outline-none transform transition-all duration-500 scale-100 opacity-100"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500"
        closeTimeoutMS={500}
      >
        <div className="text-center animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-bounce">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Спасибо!</h3>
          <p className="text-gray-600">Мы с вами свяжемся в ближайшее время.</p>
        </div>
      </Modal>
    </>
  );
}

export default Footer;
