import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Statistics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/statistics`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки статистики", err);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // каждые 30 сек

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (stats.length === 0) return <div className="text-center py-10">Нет данных</div>;

  return (
    <div className="bg-[#F2F8FF] py-8 border-t border-b">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-around items-center text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col">
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString("ru-RU")}
              </p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;