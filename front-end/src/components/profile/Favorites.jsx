// src/components/profile/Favorites.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Heart, Package } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        toast.error("Не удалось загрузить избранное",err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const removeFromFavorites = async (lockId) => {
    try {
      await fetch(`${API_URL}/api/favorites/${lockId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setFavorites(favorites.filter(f => f.id !== lockId));
      toast.success("Удалено из избранного");
    } catch (err) {
      toast.error("Ошибка",err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Загрузка избранного...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
        <p className="text-2xl mb-4 text-gray-600">Вы ещё ничего не добавили в избранное</p>
        <Link to="/catalog" className="text-indigo-600 font-bold hover:underline text-lg">
          Перейти в каталог →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Избранное ({favorites.length})</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((lock) => (
          <div key={lock.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
            <Link to={`/product/${lock.id}`}>
              <div className="relative">
                <img
                  src={`${API_URL}${lock.image_path}`}
                  alt={lock.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromFavorites(lock.id);
                  }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:scale-110 transition"
                >
                  <Heart className="w-6 h-6 text-red-600 fill-current" />
                </button>
              </div>
            </Link>

            <div className="p-6">
              <Link to={`/product/${lock.id}`} className="block">
                <h3 className="font-bold text-xl text-gray-900 hover:text-indigo-600 transition">
                  {lock.name}
                </h3>
                <p className="text-gray-600 mt-1">Арт: {lock.article}</p>
              </Link>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-indigo-600">
                    {Number(lock.price_with_discount || lock.price).toLocaleString()} ₽
                  </p>
                  {lock.price_with_discount && (
                    <del className="text-gray-400">{Number(lock.price).toLocaleString()} ₽</del>
                  )}
                </div>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition shadow-lg">
                  В корзину
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}