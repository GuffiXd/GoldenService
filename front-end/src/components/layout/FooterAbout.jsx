import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { MapPin, Phone, Mail, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Фикс иконки Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_URL = "http://localhost:5000";
Modal.setAppElement("#root");

function AboutFooter() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const logoRef = useRef(null);

  // Параллакс логотипа
  useEffect(() => {
    const handleMouse = (e) => {
      const rect = logoRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / 20;
        const y = (e.clientY - rect.top - rect.height / 2) / 20;
        setMousePos({ x, y });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Введите имя";
    else if (formData.name.trim().length < 2) newErrors.name = "Минимум 2 символа";

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

      if (!response.ok) throw new Error("Ошибка сервера");

      setFormData({ name: "", email: "" });
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      alert(err.message || "Ошибка. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-white via-gray-50 to-indigo-50">
        {/* ВЕРХНЯЯ ЧАСТЬ — ФОРМА + КОНТАКТЫ */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

              {/* ЛЕВАЯ ЧАСТЬ — ФОРМА */}
              <div className="space-y-8">
                <div className="animate-fade-in">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Остались <span className="text-indigo-600">вопросы</span>?
                  </h2>
                  <p className="text-lg text-gray-600 max-w-md">
                    Заполните форму — и мы свяжемся с вами в течение 15 минут
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ваше имя"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 rounded-2xl bg-white border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all ${
                      errors.name ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 rounded-2xl bg-white border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all ${
                      errors.email ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Отправка...
                      </span>
                    ) : (
                      <>
                        Отправить
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {(errors.name || errors.email) && (
                  <p className="text-red-500 text-sm animate-fade-in">
                    {errors.name || errors.email}
                  </p>
                )}
              </div>

              {/* ПРАВАЯ ЧАСТЬ — КОНТАКТЫ + ФОТО */}
              <div className="space-y-10">
                <h3 className="text-3xl font-black text-gray-900 animate-fade-in">Контакты</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                  <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <p className="font-bold text-indigo-600 mb-2">Адрес</p>
                    <p className="text-gray-600 leading-relaxed">
                      Россия, Ростов-на-Дону<br />
                      ул. Богачева, 16
                    </p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <p className="font-bold text-indigo-600 mb-2">Телефоны</p>
                    <p className="text-gray-600">
                      <a href="tel:+79885650038" className="hover:text-indigo-600 transition">+7 (988) 565 00 38</a><br />
                      <a href="tel:+375336628256" className="hover:text-indigo-600 transition">+375 33 662 82 56</a>
                    </p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <p className="font-bold text-indigo-600 mb-2">Email</p>
                    <p className="text-gray-600">
                      <a href="mailto:vladpertcev@mail.ru" className="hover:text-indigo-600 transition">vladpertcev@mail.ru</a><br />
                      <a href="mailto:korobko416@gmail.com" className="hover:text-indigo-600 transition">korobko416@gmail.com</a>
                    </p>
                  </div>
                </div>

                {/* ФОТО ПРОИЗВОДСТВА */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {["factory1.webp", "factory2.webp", "factory3.webp"].map((img, i) => (
                    <div
                      key={i}
                      className="group relative rounded-2xl overflow-hidden shadow-lg animate-fade-in"
                      style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img
                        src={`${API_URL}/images/all/${img}`}
                        alt={`Производство ${i + 1}`}
                        className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* НИЖНЯЯ ЧАСТЬ — ТЁМНЫЙ ФУТЕР */}
        <div className="bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* 3D ЛОГОТИП */}
              <div
                ref={logoRef}
                className="lg:col-span-1"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative bg-gray-900 p-6 rounded-3xl shadow-2xl">
                    <img
                      src={`${API_URL}/images/icons/logo-footer.svg`}
                      alt="Golden Soft"
                      className="h-16 filter drop-shadow-lg"
                    />
                    <p className="text-xs text-indigo-400 mt-2">Умные замки с 2021 года</p>
                  </div>
                </div>
              </div>

              {/* НАВИГАЦИЯ */}
              <div>
                <h3 className="font-bold text-lg mb-5 text-indigo-400">Навигация</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><Link to="/" className="hover:text-white transition">Главная</Link></li>
                  <li><Link to="/catalog" className="hover:text-white transition">Каталог</Link></li>
                  <li><Link to="/wholesale" className="hover:text-white transition">Оптовая продажа</Link></li>
                  <li><Link to="/about" className="hover:text-white transition">О нас</Link></li>
                </ul>
              </div>

              {/* КОНТАКТЫ */}
              <div>
                <h3 className="font-bold text-lg mb-5 text-indigo-400">Контакты</h3>
                <div className="space-y-4 text-gray-400">
                  <a href="tel:+79885650038" className="flex items-center gap-3 hover:text-white transition">
                    <Phone className="w-5 h-5 text-indigo-500" />
                    <span>+7 (988) 565 00 38</span>
                  </a>
                  <a href="mailto:vladpertcev@mail.ru" className="flex items-center gap-3 hover:text-white transition">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span>vladpertcev@mail.ru</span>
                  </a>
                  <a href="https://golden-soft.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    <span>golden-soft.com</span>
                  </a>
                </div>
              </div>

              {/* АДРЕС + КАРТА */}
              <div>
                <h3 className="font-bold text-lg mb-5 text-indigo-400">Адрес</h3>
                <p className="text-gray-400 mb-4">
                  Россия, Ростов-на-Дону<br />
                  ул. Богачева, 16
                </p>
                <div className="relative rounded-2xl h-48 shadow-lg overflow-hidden">
                  <MapContainer
                    center={[47.2357, 39.7022]}
                    zoom={16}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[47.2357, 39.7022]}>
                      <Popup>
                        <strong>Golden Soft</strong><br />
                        ул. Богачева, 16<br />
                        Ростов-на-Дону
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {/* ИНФОРМАЦИЯ */}
              <div>
                <h3 className="font-bold text-lg mb-5 text-indigo-400">Информация</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><Link to="/delivery" className="hover:text-white transition">Доставка</Link></li>
                  <li><Link to="/warranty" className="hover:text-white transition">Гарантия</Link></li>
                  <li><Link to="/return" className="hover:text-white transition">Возврат</Link></li>
                </ul>
              </div>
            </div>

            {/* КОПИРАЙТ */}
            <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
              © 2025 Golden Soft. Все права защищены. Сделано с <span className="text-red-500">сердцем</span> в Ростове
            </div>
          </div>
        </div>
      </footer>

      {/* Модалка успеха */}
      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md mx-4 p-8 outline-none"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        closeTimeoutMS={300}
      >
        <div className="text-center animate-scale-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3">Готово!</h3>
          <p className="text-gray-600">Мы свяжемся с вами в течение 15 минут</p>
        </div>
      </Modal>
    </>
  );
}

export default AboutFooter;