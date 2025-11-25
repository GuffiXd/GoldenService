import React, { useEffect, useState } from "react";
import api from "../../config/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get("/api/admin/stats");
                setStats(data);
            } catch (error) {
                console.error("Ошибка загрузки статистики:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Загрузка статистики...</div>;

    return (
        <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#1e293b" }}>Обзор системы</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                <StatCard title="Пользователи" value={stats.users} color="#3b82f6" />
                <StatCard title="Заказы" value={stats.orders} color="#10b981" />
                <StatCard title="Товары" value={stats.products} color="#f59e0b" />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderLeft: `5px solid ${color}` }}>
        <h3 style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "10px" }}>{title}</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", margin: 0 }}>{value}</p>
    </div>
);

export default AdminDashboard;
