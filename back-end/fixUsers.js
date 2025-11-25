const bcrypt = require("bcrypt");
const { sequelize, User } = require("./models");

async function fixUsers() {
  try {
    await sequelize.authenticate();
    console.log("MySQL подключен. Обновляю пароли пользователей...");

    const hash = await bcrypt.hash("123456", 10);
    
    // Обновляем ВСЕХ пользователей, у которых пароль "hashedpass" или вообще всех
    // Для надежности обновим ivan@example.com
    const [updated] = await User.update(
      { password: hash },
      { where: { email: "ivan@example.com" } }
    );

    if (updated > 0) {
      console.log(`Обновлен пароль для ivan@example.com. Новый пароль: 123456`);
    } else {
      // Если вдруг пользователя нет (хотя он должен быть из сида), создадим его
      console.log("Пользователь не найден, создаю...");
      await User.create({
          name: "Иван Иванов",
          email: "ivan@example.com",
          phone: "+79001234567",
          password: hash,
          role: "user",
      });
      console.log("Создан пользователь ivan@example.com / 123456");
    }

  } catch (e) {
    console.error("Ошибка обновления:", e);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

fixUsers();
