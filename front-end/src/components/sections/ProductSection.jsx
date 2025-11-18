// src/components/sections/ProductSection.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Check, Shield, Clock, Star, Truck, Sparkles, User } from "lucide-react";

const API_URL = "http://localhost:5000";

// Безопасное форматирование цены
const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  return isNaN(num) ? "—" : num.toLocaleString("ru-RU");
};

// Форматирование даты отзыва: "15 марта 2025"
const formatReviewDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Компонент одной звёздочки (для рейтинга)
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export default function ProductSection() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/locks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки товара:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center">
        <p className="text-3xl font-bold text-gray-800 mb-6">Товар не найден</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-indigo-600 hover:underline">
          ← Вернуться в каталог
        </Link>
      </div>
    );
  }

  const currentPrice = Number(product.price_with_discount) || Number(product.price) || 0;
  const oldPrice = product.price_with_discount ? Number(product.price) : null;
  const totalPrice = currentPrice * quantity;

  const allImages = [product.image_path, ...(product.image_gallery || [])];
  const reviews = product.reviews || []; // ← Вот они, настоящие отзывы!

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-indigo-600 transition">Главная</Link>
          <span>→</span>
          <Link to="/catalog" className="hover:text-indigo-600 transition">Каталог</Link>
          {product.category && (
            <>
              <span>→</span>
              <Link to={`/catalog?category=${product.category.slug}`} className="hover:text-indigo-600 transition">
                {product.category.name}
              </Link>
            </>
          )}
          <span>→</span>
          <span className="text-indigo-600 font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Левая часть — фото */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              <img
                src={`${API_URL}${allImages[selectedImage]}`}
                alt={product.name}
                className="w-full h-[500px] md:h-[650px] object-contain rounded-3xl shadow-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-8 transition-all duration-500 hover:scale-[1.02]"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600">Новинка 2025</span>
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-2xl overflow-hidden border-4 transition-all ${
                      selectedImage === i
                        ? "border-indigo-600 shadow-lg scale-105"
                        : "border-transparent hover:border-indigo-300"
                    }`}
                  >
                    <img src={`${API_URL}${img}`} alt="" className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Правая часть — информация */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mt-3">Артикул: {product.article}</p>

              {/* Рейтинг из отзывов */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-6 mt-6">
                  <StarRating rating={Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length)} />
                  <span className="text-lg font-bold text-gray-700">
                    {reviews.length > 0
                      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
                      : "—"}
                  </span>
                  <span className="text-gray-600">({reviews.length} отзывов)</span>
                </div>
              )}
            </div>

            {/* Цена */}
            <div className="flex items-baseline gap-6">
              <span className="text-6xl font-black text-indigo-600">
                {formatPrice(currentPrice)} ₽
              </span>
              {oldPrice && (
                <del className="text-3xl text-gray-400">{formatPrice(oldPrice)} ₽</del>
              )}
              {oldPrice && (
                <span className="bg-rose-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  −{Math.round(((oldPrice - currentPrice) / oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Количество */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <p className="font-bold text-lg mb-4">Количество</p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-2xl flex items-center justify-center transition disabled:opacity-50 shadow-md"
                  disabled={quantity <= 1}
                >
                  <span className="text-2xl font-black">−</span>
                </button>
                <span className="text-3xl font-black w-20 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-2xl flex items-center justify-center transition shadow-md"
                >
                  <span className="text-2xl font-black">+</span>
                </button>
              </div>
              <p className="text-xl font-bold mt-5 text-gray-800">
                Итого: <span className="text-indigo-600 text-3xl">{formatPrice(totalPrice)} ₽</span>
              </p>
            </div>

            {/* Кнопки */}
            <div className="flex gap-5">
              <button className="flex-1 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-3xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3">
                <ShoppingCart className="w-7 h-7" />
                Купить сейчас
              </button>
              <button
                onClick={() => setInWishlist(!inWishlist)}
                className={`p-6 rounded-3xl border-4 transition-all shadow-xl ${
                  inWishlist
                    ? "bg-red-50 border-red-500"
                    : "border-gray-200 hover:border-indigo-600 bg-white"
                }`}
              >
                <Heart className={`w-8 h-8 transition-all ${inWishlist ? "text-red-600 fill-current" : "text-gray-600"}`} />
              </button>
            </div>

            {/* Доставка */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200/50 shadow-xl">
              <h4 className="text-2xl font-black flex items-center gap-3 mb-6">
                <Truck className="w-8 h-8 text-indigo-600" />
                Доставка и гарантия
              </h4>
              <div className="space-y-5 text-gray-700 text-lg">
                <div className="flex items-center gap-4"><Check className="w-6 h-6 text-emerald-600" /> Бесплатная доставка по России от 50 000 ₽</div>
                <div className="flex items-center gap-4"><Shield className="w-6 h-6 text-indigo-600" /> Официальная гарантия 3 года</div>
                <div className="flex items-center gap-4"><Clock className="w-6 h-6 text-purple-600" /> Установка мастером за 1 час</div>
              </div>
            </div>
          </div>
        </div>

        {/* Характеристики */}
        <div className="mt-24 grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <h3 className="text-3xl font-black mb-8 text-gray-900">Технические характеристики</h3>
            <table className="w-full text-left text-lg">
              <tbody className="divide-y divide-gray-200">
                <tr><td className="py-4 pr-8 font-semibold text-gray-700">Тип двери</td><td>{product.door_type || "Металлическая / Деревянная"}</td></tr>
                <tr><td className="py-4 pr-8 font-semibold text-gray-700">Толщина двери</td><td>{product.door_thickness || "40–120 мм"}</td></tr>
                <tr><td className="py-4 pr-8 font-semibold text-gray-700">Способы открытия</td><td>{product.unlocking_methods?.join(", ") || "Отпечаток, код, карта, ключ, приложение"}</td></tr>
                <tr><td className="py-4 pr-8 font-semibold text-gray-700">Автономность</td><td>{product.battery_life || "До 12 месяцев"}</td></tr>
                <tr><td className="py-4 pr-8 font-semibold text-gray-700">Материал корпуса</td><td>{product.material || "Алюминиевый сплав"}</td></tr>
                <tr><td className="py-4 pr-8 font-semibold text-gray-700">Вес</td><td>{product.weight || "3.8 кг"}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-2xl">
            <h3 className="text-3xl font-black mb-8">Комплектация премиум</h3>
            <ul className="space-y-5 text-lg">
              {["Внешняя и внутренняя панель", "RFID-карты (3 шт)", "Механические ключи (2 шт)", "Батарейки AA (8 шт)", "Крепёжный комплект + шаблон", "Инструкция на русском"].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <Check className="w-7 h-7 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ОТЗЫВЫ — РЕАЛЬНЫЕ ИЗ БАЗЫ! */}
        <div className="mt-24">
          <h3 className="text-4xl md:text-5xl font-black text-center mb-16">
            {reviews.length > 0 ? `Отзывы покупателей (${reviews.length})` : "Пока нет отзывов"}
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
              <User className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-600">Будьте первым, кто оставит отзыв!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900">{review.author}</p>
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} />
                        {review.isVerified && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            Проверенный покупатель
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">{review.text}</p>
                  <p className="text-sm text-gray-500 mt-4">{formatReviewDate(review.date || review.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 