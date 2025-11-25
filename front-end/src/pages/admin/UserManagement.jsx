import React, { useEffect, useState } from "react";
import api from "../../config/api";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/api/admin/users");
            setUsers(data);
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await api.put(`/api/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error("Ошибка обновления роли:", error);
            alert("Не удалось обновить роль");
        }
    };

    if (loading) return <div>Загрузка пользователей...</div>;

    return (
        <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#1e293b" }}>Управление пользователями</h1>
            <div style={{ backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <tr>
                            <th style={{ padding: "15px", textAlign: "left", color: "#64748b" }}>ID</th>
                            <th style={{ padding: "15px", textAlign: "left", color: "#64748b" }}>Имя</th>
                            <th style={{ padding: "15px", textAlign: "left", color: "#64748b" }}>Email</th>
                            <th style={{ padding: "15px", textAlign: "left", color: "#64748b" }}>Роль</th>
                            <th style={{ padding: "15px", textAlign: "left", color: "#64748b" }}>Дата регистрации</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "15px", color: "#334155" }}>{user.id}</td>
                                <td style={{ padding: "15px", color: "#334155" }}>{user.name}</td>
                                <td style={{ padding: "15px", color: "#334155" }}>{user.email}</td>
                                <td style={{ padding: "15px" }}>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        style={{ padding: "5px", borderRadius: "5px", border: "1px solid #cbd5e1", backgroundColor: user.role === 'admin' ? '#fef3c7' : '#fff' }}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td style={{ padding: "15px", color: "#64748b" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
