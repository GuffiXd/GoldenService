import React, { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { Users, Package, ShoppingCart, Award } from "lucide-react";

const API_URL = "http://localhost:5000";
const icons = [Users, Package, ShoppingCart, Award];

function AnimatedCounter({ value }) {
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 100, damping: 20 });
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (inView) {
      count.set(value);
    }
  }, [inView, value, count]);

  return (
    <span
      ref={ref}
      className="font-black text-4xl md:text-5xl text-gray-900 inline-block"
    >
      {rounded.get().toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
    </span>
  );
}

function Statistics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const cacheKey = "statistics_cache";
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;

        if (cacheAge < 5 * 60 * 1000) {
          setStats(data);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(`${API_URL}/api/statistics`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setStats(data);
        setLoading(false);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch (err) {
        console.error("Ошибка загрузки статистики", err);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                <div className="h-12 bg-gray-200 rounded-xl mb-2 mx-auto w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stats.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-indigo-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = icons[index] || Award;

            return (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Иконка */}
                <div className="mb-4 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Счётчик */}
                <div className="mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>

                {/* Подпись */}
                <p className="text-sm md:text-base font-medium text-gray-600 tracking-wide">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Statistics;