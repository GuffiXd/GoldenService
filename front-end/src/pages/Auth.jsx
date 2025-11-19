// src/pages/Auth.jsx
import { useState } from "react";
import { useAuth } from "../context/useAuth";
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      {/* Анимированный градиентный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-transparent animate-pulse delay-700" />
      </div>

      {/* Плавные волны */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="rgba(139, 92, 246, 0.1)"
          fillOpacity="0.3"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-wave"
        />
        <path
          fill="rgba(79, 70, 229, 0.15)"
          fillOpacity="0.2"
          d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,176C672,160,768,160,864,176C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L0,320Z"
          className="animate-wave-delay"
        />
      </svg>

      {/* Звёздочки / блёстки */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Основная карточка */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20
                          transform hover:scale-[1.02] transition-all duration-500"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                  <span className="text-white font-black text-4xl">G</span>
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  GoldenSoft
                </h1>
              </div>
              <p className="text-2xl text-white/90 font-medium drop-shadow-lg">
                {isLogin
                  ? "Добро пожаловать назад!"
                  : "Присоединяйтесь к будущему"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 
                               focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 
                               transition-all text-lg backdrop-blur-xl"
                  />
                  <input
                    type="tel"
                    placeholder="Телефон"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 
                               focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 
                               transition-all text-lg backdrop-blur-xl"
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 
                           focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 
                           transition-all text-lg backdrop-blur-xl"
              />

              <input
                type="password"
                placeholder="Пароль"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 
                           focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 
                           transition-all text-lg backdrop-blur-xl"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xl rounded-2xl 
                           hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 
                           shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading
                    ? "Подождите..."
                    : isLogin
                    ? "Войти в аккаунт"
                    : "Создать аккаунт"}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-white/80 text-lg">
                {isLogin ? "Ещё нет аккаунта? " : "Уже с нами? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setForm({ name: "", email: "", phone: "", password: "" });
                  }}
                  className="font-bold text-cyan-300 hover:text-cyan-100 underline underline-offset-4 transition-all"
                >
                  {isLogin ? "Зарегистрироваться" : "Войти"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
  @keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes wave-delay {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  .animate-wave {
    animation: wave 20s ease-in-out infinite;
  }
  .animate-wave-delay {
    animation: wave-delay 25s ease-in-out infinite;
  }
  .animate-twinkle {
    animation: twinkle linear infinite;
  }
`}
      </style>
    </div>
  );
}
