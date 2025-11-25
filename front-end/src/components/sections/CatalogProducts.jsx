// src/components/sections/CatalogProducts.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../../context/useAuth"; 
import api from "../../config/api"; 
import toast from "react-hot-toast"; 

const API_URL = "http://localhost:5000";

export default function CatalogProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set()); 
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 12,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);

        if (!params.has("page")) {
          params.set("page", "1");
        }
        params.set("limit", "12");

        const res = await fetch(`${API_URL}/api/locks?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();

        setProducts(result.data || []);
        setPagination({
          total: result.pagination?.total || 0,
          page: result.pagination?.page || 1,
          pages: result.pagination?.pages || 1,
          limit: result.pagination?.limit || 12,
        });
      } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await api.get("/api/favorites");
        const ids = new Set(res.data.map((f) => f.id));
        setFavorites(ids);
      } catch (err) {
        console.error("Ошибка загрузки избранного");
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (e, product) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (!user) {
      toast.error("Войдите в аккаунт");
      return;
    }

    const isLiked = favorites.has(product.id);
    
    const newFavorites = new Set(favorites);
    if (isLiked) newFavorites.delete(product.id);
    else newFavorites.add(product.id);
    setFavorites(newFavorites);

    try {
      if (isLiked) {
        await api.delete(`/api/favorites/${product.id}`);
        toast.success("Удалено из избранного");
      } else {
        await api.post(`/api/favorites/${product.id}`);
        toast.success("Добавлено в избранное");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ошибка обновления избранного");
      setFavorites(favorites);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.pages) return;

    const params = new URLSearchParams(location.search);
    params.set("page", page);

    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-lg animate-pulse h-96">
            <div className="h-64 bg-gray-200 rounded-t-3xl" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-3xl font-bold text-gray-600 mb-8">
          По вашим фильтрам ничего не найдено
        </p>
        <button
          onClick={() => navigate("/catalog")}
          className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:scale-105 transition shadow-2xl"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
        {products.map((product, index) => {
          const isLiked = favorites.has(product.id);

          return (
            <div key={product.id} className="animate-fade-in group" style={{ animationDelay: `${index * 80}ms` }}>
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden border border-transparent hover:border-indigo-100"
              >
                <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={`${API_URL}${product.image_path}`}
                    alt={product.name}
                    className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                    <div className={`w-3 h-3 rounded-full ${product.in_stock ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span className={`text-xs font-bold ${product.in_stock ? "text-emerald-700" : "text-rose-700"}`}>
                      {product.in_stock ? "В наличии" : "Нет"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, product)}
                    className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur p-2.5 rounded-full shadow-lg hover:scale-110 transition active:scale-95 group/heart"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/heart:text-red-500"
                      }`}
                    />
                  </button>

                  {product.price_with_discount && (
                    <div className="absolute bottom-4 right-4 z-20">
                      <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gradient-to-t from-gray-50 to-transparent">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors h-14">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-gray-900">
                      {Number(product.price_with_discount || product.price).toLocaleString("ru-RU")} ₽
                    </span>
                    {product.price_with_discount && (
                      <span className="text-sm text-gray-400 line-through">
                        {Number(product.price).toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          );
        })}
      </div>

      {pagination.pages > 1 && (
        <div className="flex flex-col items-center mt-16">
          <p className="text-gray-600 mb-6">
            Товары {startItem}–{endItem} из {pagination.total}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-5 py-3 rounded-xl font-bold transition ${
                pagination.page === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white shadow-lg hover:shadow-xl text-indigo-600"
              }`}
            >
              ← Предыдущая
            </button>

            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1;
              if (pagination.pages > 7 && page > 3 && page < pagination.pages - 2 && Math.abs(page - pagination.page) > 1) {
                if (page === 4 || page === pagination.pages - 3) return <span key={page}>...</span>;
                return null;
              }
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-12 h-12 rounded-xl font-bold transition ${
                    page === pagination.page
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-white shadow hover:shadow-lg text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`px-5 py-3 rounded-xl font-bold transition ${
                pagination.page === pagination.pages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white shadow-lg hover:shadow-xl text-indigo-600"
              }`}
            >
              Следующая →
            </button>
          </div>
        </div>
      )}
    </>
  );
}