// src/pages/Auth.jsx
import { useState } from "react";
import { useAuth } from "../context/useAuth"; // правильный путь от pages → context
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Куда перенаправить после входа (например, из корзины → обратно в корзину)
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }

      // Успешно — переходим туда, откуда пришли, или на главную
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Ошибка сервера. Попробуйте позже.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

          {/* Логотип и заголовок */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-black text-3xl">G</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900">GoldenSoft</h1>
            </div>
            <p className="text-xl text-gray-600 font-medium">
              {isLogin ? "С возвращением!" : "Создайте аккаунт"}
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-gray-900 placeholder-gray-500 text-lg"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-gray-900 placeholder-gray-500 text-lg"
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-gray-900 placeholder-gray-500 text-lg"
            />

            <input
              type="password"
              placeholder="Пароль"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-gray-900 placeholder-gray-500 text-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Подождите..." : isLogin ? "Войти" : "Создать аккаунт"}
            </button>
          </form>

          {/* Переключение между входом и регистрацией */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 text-lg">
              {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setForm({ name: "", email: "", phone: "", password: "" });
                }}
                className="font-bold text-indigo-600 hover:underline text-lg"
              >
                {isLogin ? "Зарегистрироваться" : "Войти"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}