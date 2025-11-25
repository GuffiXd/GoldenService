const db = require("./models");
const { sequelize, User } = db;
const bcrypt = require("bcrypt");

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL подключен.");

        const email = "admin@goldenservice.com";
        const password = "adminpassword123";
        const name = "Super Admin";
        const phone = "+79990000000";

        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            console.log("Администратор уже существует.");
            existingAdmin.role = "admin"; // Ensure role is admin
            await existingAdmin.save();
            console.log("Роль обновлена на admin.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            await User.create({
                name,
                email,
                phone,
                password: hashedPassword,
                role: "admin",
            });
            console.log(`Администратор создан: ${email} / ${password}`);
        }

        process.exit();
    } catch (error) {
        console.error("Ошибка создания администратора:", error);
        process.exit(1);
    }
};

createAdmin();
