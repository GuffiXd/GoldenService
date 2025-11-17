// src/pages/Cart.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Cart() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { state: { from: "/cart" } });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="py-32 text-center">Загрузка...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-black text-center mb-10">Корзина</h1>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="text-center text-gray-600 text-xl">
            Привет, {user.name}! Здесь будет твоя корзина
          </p>
          <div className="mt-8 text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:scale-105 transition">
              Перейти к оформлению
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}