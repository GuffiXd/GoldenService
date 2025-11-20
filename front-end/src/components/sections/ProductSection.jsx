import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Check,
  Shield,
  Clock,
  Star,
  Truck,
  User as UserIcon,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

// === ХЕЛПЕРЫ ===
const formatPrice = (value) => {
  if (!value) return "—";
  const num = Number(value);
  return isNaN(num) ? "—" : num.toLocaleString("ru-RU");
};

// Используется для даты отзыва
const formatReviewDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

export default function ProductSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Используется в кнопках +/-
  const [inWishlist, setInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // 1. Загрузка товара
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

  // 2. Проверка избранного
  useEffect(() => {
    if (!user || !product) return;

    const checkWishlist = async () => {
      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const favorites = await res.json();
          // Приводим ID к строке для надежного сравнения
          const isIn = favorites.some((f) => String(f.id) === String(product.id));
          setInWishlist(isIn);
        }
      } catch (err) {
        console.error("Ошибка проверки избранного:", err);
      }
    };

    checkWishlist();
  }, [user, product]);

  // 3. Логика клика по сердцу
  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Войдите в аккаунт, чтобы добавить в избранное");
      navigate("/login");
      return;
    }

    const previousState = inWishlist;
    setInWishlist(!inWishlist); // Оптимистичное обновление

    try {
      const method = previousState ? "DELETE" : "POST";
      const res = await fetch(`${API_URL}/api/favorites/${product.id}`, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        setInWishlist(previousState);
        toast.error("Сессия истекла. Войдите заново");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Ошибка сервера");

      const data = await res.json();
      toast.success(data.message);
    } catch (err) {
      console.error("Ошибка избранного:", err);
      setInWishlist(previousState);
      toast.error("Не удалось обновить избранное");
    }
  };

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
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  // === РАСЧЕТЫ ===
  const currentPrice =
    Number(product.price_with_discount) || Number(product.price) || 0;
  const oldPrice = product.price_with_discount ? Number(product.price) : null;
  
  // Используем totalPrice в верстке
  const totalPrice = currentPrice * quantity;
  
  // Используем reviews в верстке
  const reviews = product.reviews || [];

  const parseGallery = () => {
    if (!product.image_gallery) return [];
    try {
      const parsed = JSON.parse(product.image_gallery);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Убрали (e), чтобы ESLint не ругался на unused var
      return [];
    }
  };

  const galleryImages = parseGallery();
  const mainImage = product.image_path;
  const allGalleryImages = [mainImage, ...galleryImages]
    .filter(Boolean)
    .slice(0, 4);

  const thumbnails =
    allGalleryImages.length > 0 ? allGalleryImages : [mainImage];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Навигация */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-indigo-600 transition">
            Главная
          </Link>
          <span>→</span>
          <Link to="/catalog" className="hover:text-indigo-600 transition">
            Каталог
          </Link>
          <span>→</span>
          <span className="text-indigo-600 font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ГАЛЕРЕЯ */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              <img
                src={`${API_URL}${thumbnails[selectedImage] || thumbnails[0]}`}
                alt={product.name}
                className="w-full h-[400px] md:h-[550px] object-contain rounded-3xl shadow-2xl bg-white p-4"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600">HIT</span>
              </div>
            </div>

            {thumbnails.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {thumbnails.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all h-24 ${
                      selectedImage === i
                        ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-105"
                        : "border-transparent hover:border-indigo-300"
                    }`}
                  >
                    <img
                      src={`${API_URL}${img}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ИНФОРМАЦИЯ О ТОВАРЕ */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mt-3">
                Артикул: {product.article || "—"}
              </p>
              
              {/* Рейтинг */}
              <div className="flex items-center gap-4 mt-4">
                 <StarRating rating={5} />
                 <span className="text-gray-500 text-sm">
                   ({reviews.length} отзывов)
                 </span>
              </div>
            </div>

            {/* ЦЕНА */}
            <div className="flex items-baseline gap-6">
              <span className="text-5xl font-black text-indigo-600">
                {formatPrice(currentPrice)} ₽
              </span>
              {oldPrice && (
                <>
                  <del className="text-2xl text-gray-400">
                    {formatPrice(oldPrice)} ₽
                  </del>
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SALE
                  </span>
                </>
              )}
            </div>

            {/* СЕЛЕКТОР КОЛИЧЕСТВА (Fix unused setQuantity/quantity) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-w-md">
              <p className="font-bold text-gray-700 mb-3">Количество:</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 transition"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
                
                {/* ИТОГОВАЯ ЦЕНА (Fix unused totalPrice) */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">Итого:</p>
                  <p className="text-2xl font-black text-indigo-600">
                    {formatPrice(totalPrice)} ₽
                  </p>
                </div>
              </div>
            </div>

            {/* КНОПКИ ДЕЙСТВИЯ */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2 transform active:scale-95">
                <ShoppingCart /> Добавить в корзину
              </button>

              <button
                onClick={toggleWishlist}
                className={`p-4 rounded-xl border-2 transition-all transform active:scale-95 ${
                  inWishlist
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-8 h-8 ${inWishlist ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* ПРЕИМУЩЕСТВА */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Check className="text-emerald-500 w-6 h-6" />
                <span className="text-sm font-medium">В наличии</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Truck className="text-blue-500 w-6 h-6" />
                <span className="text-sm font-medium">Быстрая доставка</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Shield className="text-purple-500 w-6 h-6" />
                <span className="text-sm font-medium">Гарантия 1 год</span>
              </div>
            </div>
          </div>
        </div>

        {/* СЕКЦИЯ ОТЗЫВОВ (Fix unused reviews/formatReviewDate) */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Отзывы покупателей ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm">
               <p className="text-gray-500">Пока нет отзывов. Станьте первым!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-50">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                            <UserIcon size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{review.author || "Пользователь"}</p>
                            <StarRating rating={review.rating || 5} />
                         </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {/* Вот здесь используется функция форматирования даты */}
                        {formatReviewDate(review.createdAt)}
                      </span>
                   </div>
                   <p className="text-gray-700 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}